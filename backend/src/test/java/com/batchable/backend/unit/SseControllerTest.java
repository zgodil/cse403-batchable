package com.batchable.backend.unit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.batchable.backend.EventSource.SseController;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SseControllerTest {

  private SseController controller;

  @Mock
  private SseEmitter emitterMock;

  @Captor
  private ArgumentCaptor<Runnable> runnableCaptor;

  @BeforeEach
  void setUp() {
    controller = new SseController();
  }

  @Test
  void subscribe_shouldReturnNewEmitterAndStoreIt() {
    // given
    Long restaurantId = 1L;

    // when
    SseEmitter result = controller.subscribe(restaurantId);

    // then
    assertThat(result).isNotNull();
    Map<Long, List<SseEmitter>> emitters = controller.getEmitters();
    assertThat(emitters).containsKey(restaurantId);
    assertThat(emitters.get(restaurantId)).containsExactly(result);
  }

  @Test
  void refreshOrderData_shouldSendEventToAllEmittersForRestaurant() throws IOException {
    // given
    Long restaurantId = 1L;
    SseEmitter emitter1 = mock(SseEmitter.class);
    SseEmitter emitter2 = mock(SseEmitter.class);

    controller.getEmitters().put(restaurantId, List.of(emitter1, emitter2));

    // when
    controller.refreshOrderData(restaurantId);

    // then
    verify(emitter1).send(any(SseEmitter.SseEventBuilder.class));
    verify(emitter2).send(any(SseEmitter.SseEventBuilder.class));
  }

  @Test
  void refreshOrderData_shouldDoNothingWhenNoEmittersForRestaurant() {
    // given
    Long restaurantId = 1L;
    // emitters map is empty

    // when
    controller.refreshOrderData(restaurantId); // should not throw

    // then no exception and no interaction with any emitter (implicitly verified)
  }

  @Test
  void refreshOrderData_shouldRemoveEmitterWhenSendFails() throws IOException {
    // given: send fails
    Long restaurantId = 1L;
    SseEmitter failingEmitter = mock(SseEmitter.class);
    doThrow(new IOException("Connection lost")).when(failingEmitter)
        .send(any(SseEmitter.SseEventBuilder.class));

    controller.getEmitters().put(restaurantId, new CopyOnWriteArrayList<>(List.of(failingEmitter)));

    // when
    controller.refreshOrderData(restaurantId);

    // then: emitter is removed from list (we do not call complete() to avoid AsyncContext
    // race when called from a non-container thread after the client has already errored)
    assertThat(controller.getEmitters().get(restaurantId)).isNull();
    verify(failingEmitter, never()).complete();
  }

  @Test
  void emitterShouldBeRemovedFromMapWhenOnCompletionIsTriggered() {
    // given
    Long restaurantId = 1L;
    SseEmitter emitter = mock(SseEmitter.class);
    controller.getEmitters().put(restaurantId, new CopyOnWriteArrayList<>(List.of(emitter)));

    // when
    controller.findAndRemove(restaurantId, emitter);

    // then
    assertThat(controller.getEmitters().get(restaurantId)).isNull();
    // If list becomes empty, the key should be removed
    assertThat(controller.getEmitters()).doesNotContainKey(restaurantId);
  }

  @Test
  void findAndRemove_shouldOnlyRemoveGivenEmitterAndKeepKeyIfListNotEmpty() {
    // given
    Long restaurantId = 1L;
    SseEmitter emitter1 = mock(SseEmitter.class);
    SseEmitter emitter2 = mock(SseEmitter.class);
    controller.getEmitters().put(restaurantId,
        new CopyOnWriteArrayList<>(List.of(emitter1, emitter2)));

    // when
    controller.findAndRemove(restaurantId, emitter1);

    // then
    assertThat(controller.getEmitters().get(restaurantId)).containsExactly(emitter2);
    assertThat(controller.getEmitters()).containsKey(restaurantId);
  }
}
