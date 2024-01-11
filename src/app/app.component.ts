import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
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
    TabViewModule,
    TooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Data Structure Project';

  hashTableItems: { key: number; value: number }[] = [];
  hashTableItemsDynamic: { key: number; value: number }[] = [];

  hashTable = new HashTable();
  dynamicHashTable = new DynamicHashTable<string, number>();
  key!: number;
  value!: number;
  result!: string;

  dynamicCapacity!: number;
  dynamicLoadFactor!: number;

  insert(): void {
    const inserted = this.hashTable.insert(this.key, this.value);
    if (inserted) {
      this.result = `Inserted key ${this.key} with value ${this.value}`;
    } else {
      this.result = `Insertion failed: Key ${this.key} already exists`;
    }

    this.updateHashTableItems();
  }

  update(): void {
    const updated = this.hashTable.update(this.key, this.value);
    this.result = updated
      ? `Updated key ${this.key} with new value ${this.value}`
      : 'Key not found, update not performed';

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

  dynamicInsert(): void {
    try {
      const previousCapacity = this.dynamicCapacity;
      this.dynamicHashTable.insert(this.key.toString(), this.value);
      const newCapacity = this.dynamicHashTable.table.length;

      if (newCapacity > previousCapacity) {
        this.result = `Table resized from ${previousCapacity} to ${newCapacity}. Inserted key ${this.key} with value ${this.value}`;
      } else {
        this.result = `Inserted key ${this.key} with value ${this.value}`;
      }
    } catch (error) {
      this.result = `Error: ${(error as Error).message}`;
    }
    this.dynamicUpdateHashTableItems();
  }

  dynamicUpdate(): void {
    try {
      this.dynamicHashTable.update(this.key.toString(), this.value);
      this.result = `Updated key ${this.key} with new value ${this.value}`;
    } catch (error) {
      this.result = `Error: ${(error as Error).message}`;
    }
    this.dynamicUpdateHashTableItems();
  }

  dynamicGetValue(): void {
    const value = this.dynamicHashTable.get(this.key.toString());
    this.result = value !== null ? `Value: ${value}` : 'Key not found';
    this.dynamicUpdateHashTableItems();
  }

  dynamicRemove(): void {
    const removed = this.dynamicHashTable.remove(this.key.toString());
    this.result = removed ? `Key ${this.key} removed` : 'Key not found';
    this.dynamicUpdateHashTableItems();
  }

  dynamicUpdateHashTableItems(): void {
    this.hashTableItemsDynamic = [];
    for (let i = 0; i < this.dynamicHashTable.table.length; i++) {
      let currentNode = this.dynamicHashTable.table[i];
      while (currentNode !== null) {
        const key = parseInt(currentNode.key);
        if (!isNaN(key)) {
          this.hashTableItemsDynamic.push({ key, value: currentNode.value });
        }
        currentNode = currentNode.next;
      }
    }
    this.dynamicCapacity = this.dynamicHashTable.table.length;
    this.dynamicLoadFactor = this.dynamicHashTable.count / this.dynamicCapacity;
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

  public insert(key: number, value: number): boolean {
    const index = this.hashFunction(key);
    let currentNode = this.table[index];

    // Check if the key already exists in the chain
    while (currentNode !== null) {
      if (currentNode.key === key) {
        // Key already exists, do not insert or update
        return false; // Insertion failed
      }
      currentNode = currentNode.next;
    }

    // Inserting the new node at the beginning of the chain
    let newNode = new Node(key, value);
    newNode.next = this.table[index];
    this.table[index] = newNode;
    return true; // Insertion successful
  }

  public update(key: number, value: number): boolean {
    const index = this.hashFunction(key);
    let currentNode = this.table[index];

    while (currentNode !== null) {
      if (currentNode.key === key) {
        currentNode.value = value;
        return true; // Update successful
      }
      currentNode = currentNode.next;
    }

    return false; // Key not found, update not performed
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

class DynamicNode<K, V> {
  key: K;
  value: V;
  next: DynamicNode<K, V> | null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class DynamicHashTable<K, V> {
  table: Array<DynamicNode<K, V> | null>;
  private size: number;
  count: number;
  private loadFactorThreshold: number;

  constructor(initialSize: number = 10, loadFactorThreshold: number = 0.75) {
    this.size = initialSize;
    this.table = new Array<DynamicNode<K, V> | null>(this.size).fill(null);
    this.count = 0;
    this.loadFactorThreshold = loadFactorThreshold;
  }

  private hashFunction(key: K): number {
    if (typeof key === 'string' || typeof key === 'number') {
      let hash = 0;
      const stringKey = key.toString();
      for (let i = 0; i < stringKey.length; i++) {
        hash += stringKey.charCodeAt(i);
      }
      return hash % this.size;
    }
    throw new Error('Unsupported key type');
  }

  private resize(): void {
    const newSize = this.size * 2;
    const newTable = new Array<DynamicNode<K, V> | null>(newSize).fill(null);
    this.table.forEach((node) => {
      let current = node;
      while (current !== null) {
        const index = this.hashFunction(current.key);
        if (newTable[index]) {
          let temp = newTable[index];
          while (temp?.next) {
            temp = temp.next;
          }
          if (temp) {
            temp.next = new DynamicNode(current.key, current.value);
          }
        } else {
          newTable[index] = new DynamicNode(current.key, current.value);
        }
        current = current.next;
      }
    });
    this.table = newTable;
    this.size = newSize;
  }

  public insert(key: K, value: V): void {
    if (this.count / this.size >= this.loadFactorThreshold) {
      this.resize();
    }
    const index = this.hashFunction(key);
    let current = this.table[index];
    let prev = null;

    while (current) {
      if (current.key === key) {
        // Key already exists, throw an error or update the value
        throw new Error('Key already exists');
      }
      prev = current;
      current = current.next;
    }

    // Insert the new node at the end of the list or as the first node if the list is empty
    const newNode = new DynamicNode(key, value);
    if (prev) {
      prev.next = newNode;
    } else {
      this.table[index] = newNode;
    }
    this.count++;
  }

  public get(key: K): V | null {
    const index = this.hashFunction(key);
    let current = this.table[index];
    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }
    return null;
  }

  public update(key: K, value: V): void {
    const index = this.hashFunction(key);
    let current = this.table[index];
    while (current) {
      if (current.key === key) {
        current.value = value;
        return;
      }
      current = current.next;
    }
    throw new Error('Key not found');
  }

  public remove(key: K): boolean {
    const index = this.hashFunction(key);
    let current = this.table[index];
    let prev = null;
    while (current) {
      if (current.key === key) {
        if (prev) {
          prev.next = current.next;
        } else {
          this.table[index] = current.next;
        }
        this.count--;
        return true;
      }
      prev = current;
      current = current.next;
    }
    return false;
  }
}
