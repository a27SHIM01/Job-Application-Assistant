<script setup>
import { ref, onMounted } from 'vue';
import FileUpload from './components/FileUpload.vue';

const response_json = ref({});
const summary = ref('');
const schedule = ref('');
const location = ref('');
const qualifications = ref([]);
const other = ref([]);
const resume_analysis = ref([]);
const error_msg = ref('');

const prompt = ref('');
const img_board_visible = ref(false);
const model = ref('gemini-2.5-flash');


function main() {
  console.log('Begin app.');
  // resetResponse();
}

function resetResponse() {
  response_json.value = {};
  summary.value = '';
  schedule.value = '';
  location.value = '';
  qualifications.value = [];
  other.value = [];
  resume_analysis.value = [];
  error_msg.value = '';
}

async function ask() {
  try {
    resetResponse();
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: model.value, 
        prompt: prompt.value 
      }),
    });
    const data = await res.json();
    parseResponse(data);
  } catch (error) {
    error_msg.value = error.message;
  }
  
}

function parseResponse(data) {
  console.log('Before', typeof(data));
  console.log(data);
  if (typeof data !== 'object') {
    try {
      data = JSON.parse(data);
    } catch (err) {
      console.log(err.message);
      data = { error: 'Incorrect response data type.' };
    }
  }
  console.log('After', typeof(data));
  console.log(data);
  if ('summary' in data) {
    console.log('summary is in data');
    response_json.value = data;
    summary.value = data.summary || 'No summary found.';
    schedule.value = data.schedule || 'No schedule found.';
    location.value = data.location || 'No location found.';
    qualifications.value = data.qualifications || ['No qualifications found.'];
    other.value = data.other || ['No other info found.'];
    console.log(data.resume_analysis);
    console.log(data.resume_analysis == []);
    if (data.resume_analysis.length < 1) {
      resume_analysis.value = ['No resume provided.'];
    }
    else {
      resume_analysis.value = data.resume_analysis;
    }
    // resume_analysis.value = (data.resume_analysis != []) ? data.resume_analysis : ['No resume provided.'];
  }
  else {
    error_msg.value = data.error || 'No data.';
  }
}


function toggleImageInput() {
  img_board_visible.value = !img_board_visible.value;
}

async function uploadClipboardImage(file) {
  const fd = new FormData();
  fd.append('file', file, file.name || 'clipboard.png');
  const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
  return res.json();
}

function onPaste(e) {
  const items = e.clipboardData?.items || [];
  console.log('onPaste');
  for (const item of items) {
    if (item.type && item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        console.log('onPaste if file');
        uploadClipboardImage(file)
          .then(r => console.log('uploaded', r))
          .catch(err => console.error(err));
      }
      // e.preventDefault();
      break;
    }
  }
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
    <hr>
    
    <FileUpload></FileUpload>

    <input class="center" @click="toggleImageInput" type="submit" value="Toggle Image Input">
  
    <div class="center" v-if="img_board_visible">
      <h2>You can also put images of the job here:</h2>
      <div class="center image_board" contenteditable="true" @paste="onPaste"></div>
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

  
  <hr>
  <div id="response">
    <h3>Debugging Panel</h3>
    <div>
      <p>Response: {{ response_json }}</p>
      <p>Error: {{ error_msg }}</p>
    </div>
    

    <h3>Gemini Response:</h3>

    <div v-if="summary != ''">
      <h4>Summary</h4><p>{{ summary }}</p><br>
      <h4>Schedule</h4><p>{{ schedule }}</p><br>
      <h4>Location</h4><p>{{ location }}</p><br>
      <h4>Qualifications</h4>
      <ul v-for="item in qualifications">
        <li>{{ item }}</li>
      </ul><br>
      <h4>Extra Info</h4>
      <ul v-for="item in other">
        <li>{{ item }}</li>
      </ul><br>
      <h4>Resume Analysis</h4>
      <ul v-for="item in resume_analysis">
        <li>{{ item }}</li>
      </ul><br>
    </div>
    
    <div v-if="error_msg != ''">
      <p>Error: {{ error_msg }}</p>
    </div>
    
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
