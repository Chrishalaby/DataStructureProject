import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'DataStructureProject2';

  hashTableItems: { key: number; value: number }[] = [];

  hashTable = new HashTable();
  key!: number;
  value!: number;
  result!: string;

  insert(): void {
    this.hashTable.insert(this.key, this.value);
    this.result = `Inserted key ${this.key} with value ${this.value}`;

    this.updateHashTableItems();
  }

  getValue(): void {
    const value = this.hashTable.get(this.key);
    this.result = value !== -1 ? `Value: ${value}` : 'Key not found';

    this.updateHashTableItems();
  }

  remove(): void {
    const removed = this.hashTable.remove(this.key);
    this.result = removed ? `Key ${this.key} removed` : 'Key not found';

    this.updateHashTableItems();
  }

  updateHashTableItems(): void {
    this.hashTableItems = [];
    for (let i = 0; i < this.hashTable.table.length; i++) {
      let currentNode = this.hashTable.table[i];
      while (currentNode !== null) {
        this.hashTableItems.push({
          key: currentNode.key,
          value: currentNode.value,
        });
        currentNode = currentNode.next;
      }
    }
  }
}
class Node {
  key: number;
  value: number;
  next: Node | null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {
  private size: number;
  table: Array<Node | null>;

  constructor(size: number = 10) {
    this.size = size;
    this.table = new Array<Node | null>(size).fill(null);
  }

  private hashFunction(key: number): number {
    return key % this.size;
  }

  public insert(key: number, value: number): void {
    const index = this.hashFunction(key);
    let newNode = new Node(key, value);
    let currentNode = this.table[index];
    let prevNode = null;

    if (!currentNode) {
      this.table[index] = newNode;
      return;
    }

    while (currentNode !== null) {
      if (currentNode.key === key) {
        currentNode.value = value;
        return;
      }
      prevNode = currentNode;
      currentNode = currentNode.next;
    }

    if (prevNode) {
      prevNode.next = newNode;
    }
  }

  public get(key: number): number {
    const index = this.hashFunction(key);
    let currentNode = this.table[index];

    while (currentNode !== null) {
      if (currentNode.key === key) {
        return currentNode.value;
      }
      currentNode = currentNode.next;
    }

    return -1; // Key not found
  }

  public remove(key: number): boolean {
    const index = this.hashFunction(key);
    let currentNode = this.table[index];
    let prevNode = null;

    while (currentNode !== null) {
      if (currentNode.key === key) {
        if (!prevNode) {
          this.table[index] = currentNode.next;
        } else {
          prevNode.next = currentNode.next;
        }
        return true;
      }
      prevNode = currentNode;
      currentNode = currentNode.next;
    }

    return false; // Key not found
  }
}
