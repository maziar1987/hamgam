import {Component, Input, OnInit} from '@angular/core';
import {WebsocketBuilder, Websocket} from 'websocket-ts';
import {WebsocketService} from './websocket-service';

export class TestPageComponent implements OnInit {

  username = '';
  ws: Websocket;

  constructor(private websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.username = 'admin';
  }

  getUri() {
    alert(this.websocketService.getWebsocketUri('message'));
  }

  connect() {
    const uri = this.websocketService.getWebsocketUri('message');

    this.ws = new WebsocketBuilder(uri)
      .onOpen((i, ev) => {
        console.log('opened');
      })
      .onClose((i, ev) => {
        console.log('closed');
      })
      .onError((i, ev) => {
        console.log('error');
      })
      .onMessage((i, ev) => {
        console.log('message : ' + ev.data);
        alert(ev.data);
      })
      .onRetry((i, ev) => {
        console.log('retry');
      })
      .build();
  }

  disconnect() {
    console.log('disconnect');
    this.ws.close();
  }

  message() {
    console.log('client-message');
    this.ws.send('salam');
  }

}
