import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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

  initValue: Group[] = [];
  currentGroup: Group = {} as Group;
  subGroups: SubGroup[] = [];
  cartItems: CartItem[] = [];
  result: Coding[] = [];
  cart: Array<[string, Array<CartItem>]> = [];
  keyword: string = '';
  isSearch: boolean = false;

  ngOnInit(): void {
    this.#cleanCheck();
    this.initValue = this.value;
    this.currentGroup = this.value[0]
  }

  onGroupClick(group: Group) {
    this.subGroups = [];
    this.#cleanCheck();
    this.currentGroup = group;
  }

  onSubGroupChange(subGroup: SubGroup) {
    if (subGroup.showItems) {
      this.subGroups.push(subGroup);
    } else {
      const index = this.subGroups.indexOf(subGroup);
      if (index !== -1) {
        this.subGroups.splice(index, 1);
      }
    }
  }

  onItemClick(coding: Coding, group: Group, subGroup?: SubGroup) {
    const isExist = this.#checkCodingExist(coding.code);
    if (!isExist) this.#addCoding(coding, group, subGroup);
    this.#groupingCart();
  }

  onCartClick(cartItem: CartItem) {
    const index = this.cartItems.indexOf(cartItem);
    if (index !== -1) this.cartItems.splice(index, 1);
    this.#groupingCart();
  }

  onOkClick() {
    this.result = this.cartItems.map((i) => i.item);
    this.resultSelected.emit(this.result);
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
    this.value = this.initValue;
  }

  #cleanCheck(): void {
    this.value.forEach(group => {
      if (group.subGroups) {
        group.subGroups.forEach(subGroup => {
          subGroup.showItems = false;
        });
      }
    });
  }

  #checkCodingExist(code: string): boolean {
    for (const cartItem of this.cartItems) {
      if (cartItem.item.code === code) {
        return true;
      };
    }
    return false;
  }

  #addCoding(coding: Coding, group: Group, subGroup?: SubGroup) {
    const groupName = group.groupName;
    const subGroupName = subGroup ? `>${subGroup.subGroupName}` : "";
    const newCoding = coding;
    this.cartItems.push({
      title: `${groupName}${subGroupName}`,
      item: newCoding
    });
  }

  #groupingCart(): void {
    const tmp = this.cartItems.groupBy((a) => a.title);
    this.cart = Object.entries(tmp);
  }
}
