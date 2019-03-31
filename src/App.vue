<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}
body {
  margin: 0;
}
</style>
<style media="screen">
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #f7f7f7
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #1fa67a;
}

::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255,0,0,0.4);
}
::selection {
  background: #33b6a5;
  color: white
}
</style>
