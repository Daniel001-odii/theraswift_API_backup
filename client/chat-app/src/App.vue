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


  export default {
    data(){
      return{
        // socket: io("https://api.theraswift.co", { autoConnect: true}),
        socket: io("http://localhost:3000", { autoConnect: true}),
        text: '',
        messages: [],
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTA4ZGM4NjJiNGY0OTEyYTQ0OTFhZiIsImVtYWlsIjoieGVuaXRoaGVpZ2h0KzJAZ21haWwuY29tIiwiaWF0IjoxNzI2MDU0MTk4fQ.eChWz_Ctbb9Vy4GvddHVXjILfhfxgmKmsLL4rU57mDg'
        },

        ROOM_ID: "67295fbaf73ae114e9a8531a",
      }
    },

    methods: {
      async sendMessage(){
        try{
          const response = await axios.post(`http://localhost:3000/admin/chat_rooms/${this.ROOM_ID}/new_message`, { text:this.text }, {
            headers: this.headers
          });
          this.text = '';
          // this.messages.unshift(this.text);
          // console.log("from sent msg: ", response)
        }catch(error){
          console.log('error sending message: ', error);
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
    

     
  
    }
  }
</script>

<style scoped>

</style>