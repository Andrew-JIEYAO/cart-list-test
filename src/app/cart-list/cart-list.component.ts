import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, WritableSignal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, Coding, Group, SubGroup } from './cart-list.interface';
import { FormsModule } from '@angular/forms';
import "@his-base/array-extension";

@Component({
  selector: 'his-cart-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  @Input() value: Group[] = [];
  @Output() resultSelected = new EventEmitter<Coding[]>();
  @Output() search = new EventEmitter<string>;

  #initValue: Group[] = [];
  currentGroup: Group = {} as Group;
  subGroups: SubGroup[] = [];

  cartItems: WritableSignal<CartItem[]> = signal([]);
  groupItems = computed(() => this.cartItems().groupBy(v => v.title))
  groupTitle = computed(() => Object.keys(this.groupItems()))


  keyword: string = '';
  isSearch: boolean = false;

  ngOnInit(): void {
    this.#initValue = this.value;
    this.currentGroup = this.value[0]
  }

  onGroupClick(group: Group) {
    this.subGroups = [];
    this.currentGroup = group;
  }

  onSubGroupClick(subGroup: SubGroup) {
    if (subGroup.isShow) {
      this.subGroups.push(subGroup);
    } else {
      const index = this.subGroups.indexOf(subGroup);
      if (index !== -1) {
        this.subGroups.splice(index, 1);
      }
    }
  }

  onItemClick(coding: Coding, group: Group, subGroup?: SubGroup) {
    this.#addItem(coding, group, subGroup);
  }

  onCartClick(cartItem: CartItem) {
    const index = this.cartItems().indexOf(cartItem);
    console.log(index);

    if (index !== -1) this.cartItems.update(a => a.splice(index, 1));
  }

  onOkClick() {
    this.resultSelected.emit(this.cartItems().map((i) => i.item));
  }

  onSearch() {
    if (this.keyword !== '') {
      this.search.emit(this.keyword);
      this.isSearch = this.isSearch || !this.isSearch;
    }
  }

  onSearchCancel() {
    this.isSearch = this.isSearch && !this.isSearch;
    this.keyword = '';
    this.value = this.#initValue;
  }


  #addItem(coding: Coding, group: Group, subGroup?: SubGroup): void {
    const itemTilte = group.groupName.concat(subGroup ? `>${subGroup.subGroupName}` : "");
    this.cartItems.mutate(a => a.push({
      title: itemTilte,
      item: coding
    }));
    this.cartItems.update(a => a.distinct((v) => v.item.code))
  }

}
