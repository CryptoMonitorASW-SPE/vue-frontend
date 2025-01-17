<template>
    <div class="alignment-form">
      <form @submit.prevent="submitForm">
        <div>
          <label for="seq1">Sequence 1:</label>
          <input type="text" v-model="seq1" id="seq1" required />
        </div>
        <div>
          <label for="seq2">Sequence 2:</label>
          <input type="text" v-model="seq2" id="seq2" required />
        </div>
        <button type="submit">Align Sequences</button>
      </form>
  
      <div v-if="alignmentResult" class="result">
        <h3>Alignment Result:</h3>
        <p><strong>Sequence 1:</strong> {{ alignmentResult.s1 }}</p>
        <p><strong>Sequence 2:</strong> {{ alignmentResult.s2 }}</p>
        <p><strong>Aligned Sequence 1:</strong> {{ alignmentResult.as1 }}</p>
        <p><strong>Aligned Sequence 2:</strong> {{ alignmentResult.as2 }}</p>
      </div>
  
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AlignmentForm',
    data() {
      return {
        seq1: '',
        seq2: '',
        alignmentResult: null,
        message: '',
        messageType: ''
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await this.$axios.post('/submit', {
            seq1: this.seq1,
            seq2: this.seq2
          });
          this.alignmentResult = response.data;
          this.seq1 = '';
          this.seq2 = '';
          this.message = 'Sequences aligned successfully!';
          this.messageType = 'success';
        } catch (error) {
          this.message = error.response?.data?.description || 'Error aligning sequences.';
          this.messageType = 'error';
          console.error(error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .alignment-form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .alignment-form form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .alignment-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .alignment-form input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .alignment-form button {
    padding: 10px;
    font-size: 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .alignment-form button:hover {
    background-color: #369f76;
  }
  
  .result {
    margin-top: 20px;
    text-align: left;
  }
  
  .message {
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
    display: block;
  }
  
  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  </style>
  