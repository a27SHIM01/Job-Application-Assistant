<script setup>
import { ref, onMounted } from 'vue';
import Map from './components/Map.vue'

const responseText = ref('');
const prompt = ref('');
const img_board_visible = ref(false);
const model = ref('gemini-2.5-flash');


function main() {
  console.log('Begin app.')
}

async function ask() {
  const res = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      model: model.value, 
      prompt: prompt.value 
    }),
  });
  const data = await res.json();
  responseText.value = data.reply || data.error || 'ERROR: no data';
}

function toggleImageInput() {
  img_board_visible.value = !img_board_visible.value;
}


onMounted(main);
</script>

<template>
  <h1 class="center">Job Application Helper</h1>
  <h2>{{ model }}</h2>
  
  <div class="center">

    <div>
      <h2>Copy and paste the job description here.</h2>
      <h3>You can also write additional job-related prompts.</h3>
      <textarea class="text_description" v-model="prompt"></textarea>
    </div>
    

    <input class="center" @click="toggleImageInput" type="submit" value="Toggle Image Input">
  
    <div class="center" v-if="img_board_visible">
      <h2>You can also put images of the job here:</h2>
      <div class="center image_board" contenteditable="true" @paste=""></div>
    </div>

    <div class="center">
      <label for="models">Choose a Gemini model: </label>
      <select name="models" v-model="model">
        <option value="gemini-2.5-flash">gemini-2.5-flash</option>
        <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
        <option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
      </select>
    </div>

    <br>
    <input @click="ask" type="submit" value="Ask Gemini">
  </div>

  <!-- map container -->
  <!-- <div><Map></Map></div> -->
  
  <hr>
  <div id="response">
    <p>Gemini Response:</p>
    <p>{{ responseText }}</p>
  </div>
  

</template>

<style scoped>

#response {
  margin-left: auto;
  margin-right: auto;
  border-style: solid;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
}

.center {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  border-style: solid;
  margin-top: 5px;
  margin-bottom: 5px;
}

.text_description {
  border-style: dotted;
  width: 500px;
  height: 500px;
}

.image_board {
  border-style: dotted;
  width: 500px;
  height: 500px;
}

</style>
