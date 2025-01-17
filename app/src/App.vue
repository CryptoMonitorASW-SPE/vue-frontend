<template>
    <div id="app">
      <header>
        <h1>Sequence Alignment Tool</h1>
      </header>
      <main>
        <AlignmentForm />
      </main>
    </div>
  </template>
  
  <script>
  import AlignmentForm from './components/AlignmentForm.vue';
  
  export default {
    name: 'App',
    components: {
      AlignmentForm
    }
  };
  </script>
  
  <style>
  body {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  
  #app {
    text-align: center;
    padding: 20px;
  }
  
  header {
    background-color: #42b983;
    color: white;
    padding: 20px 0;
    margin-bottom: 40px;
  }
  
  main {
    display: flex;
    justify-content: center;
  }
  </style>
  