<template>
  <div>
<div v-if="messages">
  <div v-for="message in messages">
    {{ message.text }} <br/>
    {{ message.createdAt }}<br/>
    <small>from: {{ message.user }}</small>
  </div>
</div>

<form @submit.prevent="sendMessage">
  <input type="textarea" v-model="text">
  <button type="submit">send</button>
</form>

  </div>
</template>



<script>

import io from 'socket.io-client';
import axios from 'axios'
2
// let api_root = 'http://localhost:3000';
let api_root = 'https://theraswift-api-backup.onrender.com';

  export default {
    data(){
      return{
        // api_root: 'http://localhost:3000',
        // api_root: 'http://localhost:3000',
        socket: io(`${api_root}`, { autoConnect: true}),
        // socket: io(`${api_root}`, { autoConnect: true}),
        text: '',
        messages: [],
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjU2YWYwZWEwYzY5NmQ3ODI4Njk3OSIsImVtYWlsIjoieGVuaXRoaGVpZ2h0KzJAZ21haWwuY29tIiwiaWF0IjoxNzMwOTI0NjY0fQ.Ajd_8uKWh60o5CjgdEE2R-WNy2y04dpVVrPCESm_FIg'
        },

        ROOM_ID: "672aa3536e5e978648d8b5e2",
      }
    },

    methods: {
      async sendMessage(){
        try{
          const response = await axios.post(`${api_root}/admin/chat_rooms/${this.ROOM_ID}/new_message`, { text:this.text }, {
            headers: this.headers
          });
          this.text = '';
          // this.messages.unshift(this.text);
          console.log("from sent msg: ", response)
        }catch(error){
          console.log('error sending message: ', error);
        }
      },

      // getting messages...
      async getMessages(){
        try{
          // {{ROOT_URL}}/admin/chat_rooms/{{ROOM_ID}}/chats
          const response = await axios.get(`${api_root}/admin/chat_rooms/${this.ROOM_ID}/chats`, {
            headers: this.headers
          });
          this.messages = response.data.messages;
          console.log("messges: ", response);
        }catch(error){
          console.log("error getting messages: ", error);
        }
      }
    },


 

    mounted(){
      this.socket.emit('join', `${this.ROOM_ID}`);
      console.log("joined chat room successfully");
    },

    created(){
      // this.socket.emit('join', )
     const newMessage =()=>{
        try{
          this.socket.on('message', (message) => {
        this.messages.push(message);
        console.log("new message: ", message);
      });
        }catch(error){
          console.error.log("error :", error)
        }
      };

      newMessage();

      this.getMessages();
    

     
  
    }
  }
</script>

<style scoped>

</style>