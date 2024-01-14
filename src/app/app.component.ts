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

  hashTableItems: { index: number; chain: any[] }[] = [];
  hashTableItemsDynamic: { key: number; value: number }[] = [];
  hashTableItemsLinearProbing: { key: number; value: number }[] = [];
  hashTableItemsEnhanced: { key: number; value: number }[] = [];
  hashTableStructureLinearProbing: {
    index: number;
    key: any;
    value: any;
    status: string;
  }[] = [];

  hashTable = new HashTable();
  dynamicHashTable = new DynamicHashTable<string, number>();
  linearProbingHashTable = new LinearProbingHashTable();
  enhancedHashTable = new EnhancedHashTable();

  key!: number;
  value!: number;
  result!: string;

  dynamicCapacity!: number;
  dynamicLoadFactor!: number;

  // ##### HERE STARTS STATIC HASH TABLE #####

  insert(): void {
    const index = this.hashTable.hashFunction(this.key);
    const inserted = this.hashTable.insert(this.key, this.value);
    if (inserted) {
      this.result = `Inserted key ${this.key} with value ${this.value} at index ${index}`;
    } else {
      this.result = `Insertion failed: Key ${this.key} already exists at index ${index}`;
    }

    this.updateHashTableItems();
  }

  update(): void {
    const index = this.hashTable.hashFunction(this.key);
    const updated = this.hashTable.update(this.key, this.value);
    if (updated) {
      this.result = `Updated key ${this.key} with new value ${this.value} at index ${index}`;
    } else {
      this.result = `Key not found, update not performed for key ${this.key} at index ${index}`;
    }

    this.updateHashTableItems();
  }

  getValue(): void {
    const index = this.hashTable.hashFunction(this.key);
    const value = this.hashTable.get(this.key);
    if (value !== -1) {
      this.result = `Value: ${value} found at index ${index} for key ${this.key}`;
    } else {
      this.result = `Key not found: ${this.key} at index ${index}`;
    }

    this.updateHashTableItems();
  }

  remove(): void {
    const index = this.hashTable.hashFunction(this.key);
    const removed = this.hashTable.remove(this.key);
    if (removed) {
      this.result = `Key ${this.key} removed from index ${index}`;
    } else {
      this.result = `Key not found: ${this.key} at index ${index}`;
    }

    this.updateHashTableItems();
  }

  updateHashTableItems(): void {
    this.hashTableItems = [];
    for (let i = 0; i < this.hashTable.table.length; i++) {
      let chain = [];
      let currentNode = this.hashTable.table[i];
      while (currentNode !== null) {
        chain.push({ key: currentNode.key, value: currentNode.value });
        currentNode = currentNode.next;
      }
      if (chain.length > 0) {
        this.hashTableItems.push({ index: i, chain: chain });
      } else {
        // Even if it's empty, we show the slot to illustrate the structure
        this.hashTableItems.push({ index: i, chain: [] });
      }
    }
  }

  // ##### HERE STARTS DYNAMIC HASH TABLE #####

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

  // ##### FUNCTIONS FOR LINEAR PROBING HASH TABLE #####

  insertLinearProbing(): void {
    const inserted = this.linearProbingHashTable.insert(this.key, this.value);
    this.result = inserted
      ? `Inserted key ${this.key} with value ${this.value} (Linear Probing)`
      : `Insertion failed: Key ${this.key} already exists (Linear Probing)`;

    this.updateHashTableItemsLinearProbing();
  }

  updateLinearProbing(): void {
    const updated = this.linearProbingHashTable.update(this.key, this.value);
    this.result = updated
      ? `Updated key ${this.key} with new value ${this.value} (Linear Probing)`
      : 'Key not found, update not performed (Linear Probing)';

    this.updateHashTableItemsLinearProbing();
  }

  getValueLinearProbing(): void {
    const value = this.linearProbingHashTable.get(this.key);
    this.result =
      value !== null
        ? `Value: ${value} (Linear Probing)`
        : 'Key not found (Linear Probing)';

    this.updateHashTableItemsLinearProbing();
  }

  removeLinearProbing(): void {
    const removed = this.linearProbingHashTable.remove(this.key);
    this.result = removed
      ? `Key ${this.key} removed (Linear Probing)`
      : 'Key not found (Linear Probing)';

    this.updateHashTableItemsLinearProbing();
  }

  // updateHashTableItemsLinearProbing(): void {
  //   this.hashTableItemsLinearProbing = [];
  //   for (let i = 0; i < this.linearProbingHashTable.table.length; i++) {
  //     const item = this.linearProbingHashTable.table[i];
  //     if (item !== null) {
  //       this.hashTableItemsLinearProbing.push({
  //         key: item.key,
  //         value: item.value,
  //       });
  //     }
  //   }
  // }
  updateHashTableItemsLinearProbing(): void {
    this.hashTableStructureLinearProbing = [];
    for (let i = 0; i < this.linearProbingHashTable.table.length; i++) {
      const slot = this.linearProbingHashTable.table[i];
      if (slot !== null) {
        this.hashTableStructureLinearProbing.push({
          index: i,
          key: slot.key,
          value: slot.value,
          status: 'occupied',
        });
      } else {
        this.hashTableStructureLinearProbing.push({
          index: i,
          key: null,
          value: null,
          status: 'empty',
        });
      }
    }
  }

  // ##### FUNCTIONS FOR ENHANCED HASH TABLE #####

  insertEnhanced(): void {
    const inserted = this.enhancedHashTable.insert(this.key, this.value);
    this.result = inserted
      ? `Inserted key ${this.key} with value ${this.value} (Enhanced)`
      : `Insertion failed: Key ${this.key} already exists (Enhanced)`;

    this.updateHashTableItemsEnhanced();
  }

  updateEnhanced(): void {
    const updated = this.enhancedHashTable.update(this.key, this.value);
    this.result = updated
      ? `Updated key ${this.key} with new value ${this.value} (Enhanced)`
      : 'Key not found, update not performed (Enhanced)';

    this.updateHashTableItemsEnhanced();
  }

  getValueEnhanced(): void {
    const value = this.enhancedHashTable.get(this.key);
    this.result =
      value !== null
        ? `Value: ${value} (Enhanced)`
        : 'Key not found (Enhanced)';

    this.updateHashTableItemsEnhanced();
  }

  removeEnhanced(): void {
    const removed = this.enhancedHashTable.remove(this.key);
    this.result = removed
      ? `Key ${this.key} removed (Enhanced)`
      : 'Key not found (Enhanced)';

    this.updateHashTableItemsEnhanced();
  }

  updateHashTableItemsEnhanced(): void {
    this.hashTableItemsEnhanced = [];
    for (let i = 0; i < this.enhancedHashTable.table.length; i++) {
      let currentNode = this.enhancedHashTable.table[i];
      while (currentNode !== null) {
        this.hashTableItemsEnhanced.push({
          key: currentNode.key,
          value: currentNode.value,
        });
        currentNode = currentNode.next;
      }
    }
  }
}

// Static Hash Table
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

  constructor(size: number = 5) {
    this.size = size;
    this.table = new Array<Node | null>(size).fill(null);
  }

  hashFunction(key: number): number {
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

// Dynamic Hash Table

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

class EnhancedHashTable {
  private size: number;
  private loadFactorThreshold: number;
  table: Array<Node | null>;

  constructor(size: number = 10, loadFactorThreshold: number = 0.75) {
    this.size = size;
    this.loadFactorThreshold = loadFactorThreshold;
    this.table = new Array<Node | null>(size).fill(null);
  }

  private hashFunction(key: any): number {
    if (typeof key === 'number') {
      return key % this.size;
    } else if (typeof key === 'string') {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash) % this.size;
    }
    throw new Error('Unsupported key type');
  }

  private resizeIfNeeded() {
    const loadFactor = this.computeLoadFactor();
    if (loadFactor > this.loadFactorThreshold) {
      this.resize(this.size * 2);
    }
  }

  private computeLoadFactor(): number {
    let itemCount = 0;
    this.table.forEach((node) => (itemCount += node !== null ? 1 : 0));
    return itemCount / this.size;
  }

  private resize(newSize: number): void {
    const oldTable = this.table;
    this.size = newSize;
    this.table = new Array<Node | null>(this.size).fill(null);

    oldTable.forEach((node) => {
      while (node !== null) {
        this.insertWithoutResize(node.key, node.value);
        node = node.next;
      }
    });
  }

  private insertWithoutResize(key: any, value: any): void {
    const index = this.hashFunction(key);
    const newNode = new Node(key, value);
    newNode.next = this.table[index];
    this.table[index] = newNode;
  }

  public insert(key: any, value: any): boolean {
    this.resizeIfNeeded();

    const index = this.hashFunction(key);
    let currentNode = this.table[index];

    while (currentNode !== null) {
      if (currentNode.key === key) {
        return false;
      }
      currentNode = currentNode.next;
    }

    this.insertWithoutResize(key, value);
    return true;
  }

  public update(key: any, value: any): boolean {
    const index = this.hashFunction(key);
    let currentNode = this.table[index];

    while (currentNode !== null) {
      if (currentNode.key === key) {
        currentNode.value = value;
        return true;
      }
      currentNode = currentNode.next;
    }

    return false;
  }

  public get(key: any): any {
    const index = this.hashFunction(key);
    let currentNode = this.table[index];

    while (currentNode !== null) {
      if (currentNode.key === key) {
        return currentNode.value;
      }
      currentNode = currentNode.next;
    }

    return null;
  }

  public remove(key: any): boolean {
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

    return false;
  }
}

class LinearProbingHashTable {
  private size: number;
  public table: (Node | null)[];

  constructor(size: number = 3) {
    this.size = size;
    this.table = new Array<Node | null>(size).fill(null);
  }

  private hashFunction(key: any): number {
    if (typeof key === 'number') {
      return key % this.size;
    } else if (typeof key === 'string') {
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash) % this.size;
    }
    throw new Error('Unsupported key type');
  }

  public insert(key: any, value: any): boolean {
    let index = this.hashFunction(key);

    for (let i = 0; i < this.size; i++) {
      if (this.table[index] === null || this.table[index]?.key === key) {
        this.table[index] = new Node(key, value);
        return true;
      }

      index = (index + 1) % this.size;
    }

    return false; // Hash table is full
  }

  public get(key: any): any {
    let index = this.hashFunction(key);

    for (let i = 0; i < this.size; i++) {
      if (this.table[index]?.key === key) {
        return this.table[index]?.value;
      } else if (this.table[index] === null) {
        return null; // Key not found
      }

      index = (index + 1) % this.size;
    }

    return null; // Key not found
  }

  public update(key: any, value: any): boolean {
    let index = this.hashFunction(key);

    for (let i = 0; i < this.size; i++) {
      if (this.table[index]?.key === key) {
        if (this.table[index] !== null) {
          this.table[index]!.value = value;
          return true;
        }
      } else if (this.table[index] === null) {
        return false; // Key not found
      }

      index = (index + 1) % this.size;
    }

    return false; // Key not found
  }

  public remove(key: any): boolean {
    let index = this.hashFunction(key);

    for (let i = 0; i < this.size; i++) {
      if (this.table[index]?.key === key) {
        this.table[index] = null; // Mark as deleted
        return true;
      } else if (this.table[index] === null) {
        return false; // Key not found
      }

      index = (index + 1) % this.size;
    }

    return false; // Key not found
  }
}
