import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any

  constructor() { 
    this.initConnectionSocket();
  }

  initConnectionSocket() {
    const url = '//localhost:3000/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  joinRoom(roomId : string){
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe('/topic/${roomId}', (message : any) =>{
        const messageContent = JSON.parse(message.body);
        console.log(messageContent);
      })
    })
  }

  sendMessage(roomId: string, chatMessage: ChatMessage){
    this.stompClient.send('app/chat/${roomId}',{}, JSON.stringify(chatMessage))
  }
}
