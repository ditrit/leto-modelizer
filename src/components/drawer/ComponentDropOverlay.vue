<template>
  <div id="overlay">
    <div class="overlay-background"></div>
    <q-card
      id="text"
      rounded
      class="overlay-text"
      flat
    >
      <q-card-section>
        <q-avatar>
          <q-icon name="fa-solid fa-plus"></q-icon>
        </q-avatar>
        {{ $t('actions.default.dropZoneMessage') }}
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
  #overlay {
    display: none;
  }
  .overlay-background {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $primary;
  }
  .overlay-text {
    border-radius: 45px;
    background-color: white
  }
  #text{
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20px;
    color: $primary;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
  }
</style>
