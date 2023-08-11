"use strict";
// import React, { useEffect, useState } from 'react';
// import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import io from 'socket.io-client';
// import axios from 'axios';
// type Message = {
//   _id: string;
//   sender: string;
//   receiver: string;
//   message: string;
// };
// const Chat: React.FC = () => {
//   const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [usersChattedAdmin, setUsersChattedAdmin] = useState<string[]>([]);
//   useEffect(() => {
//     const socket = io('http://localhost:3000');
//     setSocket(socket);
//     socket.on('connect', () => {
//       console.log('Connected to server');
//       socket.emit('join', { userId: 'USER_ID' });
//       // Fetch users that have chatted with admin
//       axios.get('http://localhost:5000/getUsersChattedAdmin', { params: { adminId: 'ADMIN_ID' } })
//         .then((response) => {
//           setUsersChattedAdmin(response.data.users);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     });
//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });
//     socket.on('chats', ({ chats }: { chats: Message[] }) => {
//       setMessages(chats);
//     });
//     socket.on('message', (message: Message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, []);
//   const handleSendMessage = () => {
//     if (socket && newMessage.trim() !== '') {
//       const message: Message = {
//         _id: 'MESSAGE_ID',
//         sender: 'SENDER_ID',
//         receiver: 'RECEIVER_ID',
//         message: newMessage,
//       };
//       // Emit the message to the server
//       socket.emit('message', message);
//       // Add the message to the client's messages
//       setMessages((prevMessages) => [...prevMessages, message]);
//       // Clear the input field
//       setNewMessage('');
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.sidebar}>
//         <Text>Users that have chatted with admin:</Text>
//         {usersChattedAdmin.map((user) => (
//           <Text key={user}>{user}</Text>
//         ))}
//       </View>
//       <View style={styles.chatbox}>
//         <FlatList
//           data={messages}
//           keyExtractor={(message) => message._id}
//           renderItem={({ item }) => (
//             <View style={styles.messageContainer}>
//               <Text style={styles.sender}>{item.sender}</Text>
//               <Text style={styles.message}>{item.message}</Text>
//             </View>
//           )}
//         />
//         <View style={styles.inputContainer}>
//           <TextInput
// ```tsx
//           style={styles.input}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder="Type a message"
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     padding: 16,
//   },
//   sidebar: {
//     flex: 1,
//     paddingRight: 16,
//   },
//   chatbox: {
//     flex: 2,
//   },
//   messageContainer: {
//     marginBottom: 8,
//   },
//   sender: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   message: {
//     fontSize: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     paddingTop: 8,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     marginRight: 8,
//     paddingHorizontal: 8,
//   },
//   sendButton: {
//     backgroundColor: '#3498db',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
// import React, { useEffect, useState } from 'react';
// import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import io from 'socket.io-client';
// import axios from 'axios';
// type Message = {
//   _id: string;
//   sender: string;
//   receiver: string;
//   message: string;
// };
// const Chat: React.FC = () => {
//   const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [usersChattedAdmin, setUsersChattedAdmin] = useState<string[]>([]);
//   useEffect(() => {
//     const socket = io('http://localhost:3000');
//     setSocket(socket);
//     socket.on('connect', () => {
//       console.log('Connected to server');
//       socket.emit('join', { userId: 'USER_ID' });
//       // Fetch users that have chatted with admin
//       axios.get('http://localhost:5000/getUsersChattedAdmin', { params: { adminId: 'ADMIN_ID' } })
//         .then((response) => {
//           setUsersChattedAdmin(response.data.users);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     });
//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });
//     socket.on('chats', ({ chats }: { chats: Message[] }) => {
//       setMessages(chats);
//     });
//     socket.on('message', (message: Message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, []);
//   const handleSendMessage = () => {
//     if (socket && newMessage.trim() !== '') {
//       const message: Message = {
//         _id: 'MESSAGE_ID',
//         sender: 'SENDER_ID',
//         receiver: 'RECEIVER_ID',
//         message: newMessage,
//       };
//       // Emit the message to the server
//       socket.emit('message', message);
//       // Add the message to the client's messages
//       setMessages((prevMessages) => [...prevMessages, message]);
//       // Clear the input field
//       setNewMessage('');
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.sidebar}>
//         <Text>Users that have chatted with admin:</Text>
//         {usersChattedAdmin.map((user) => (
//           <Text key={user}>{user}</Text>
//         ))}
//       </View>
//       <View style={styles.chatbox}>
//         <FlatList
//           data={messages}
//           keyExtractor={(message) => message._id}
//           renderItem={({ item }) => (
//             <View style={styles.messageContainer}>
//               <Text style={styles.sender}>{item.sender}</Text>
//               <Text style={styles.message}>{item.message}</Text>
//             </View>
//           )}
//         />
//         <View style={styles.inputContainer}>
//           <TextInput
//           style={styles.input}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           placeholder="Type a message"
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     padding: 16,
//   },
//   sidebar: {
//     flex: 1,
//     paddingRight: 16,
//   },
//   chatbox: {
//     flex: 2,
//   },
//   messageContainer: {
//     marginBottom: 8,
//   },
//   sender: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   message: {
//     fontSize: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     paddingTop: 8,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     marginRight: 8,
//     paddingHorizontal: 8,
//   },
//   sendButton: {
//     backgroundColor: '#3498db',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
