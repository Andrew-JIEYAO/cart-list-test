import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Signal, SimpleChanges, WritableSignal, computed, signal } from '@angular/core';
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
export class CartListComponent implements OnInit, OnChanges {

  @Input() value: Group[] = [];
  @Output() addCart = new EventEmitter<Coding[]>();
  @Output() search = new EventEmitter<string>;

  currentGroup: Group = {} as Group;
  subGroups: SubGroup[] = [];

  cartItems: WritableSignal<CartItem[]> = signal([]);
  groupItems: Signal<Record<string, CartItem[]>> = computed(() => this.cartItems().groupBy(v => v.title));
  groupTitles: Signal<string[]> = computed(() => Object.keys(this.groupItems()));

  keyword: string = '';
  isSearch: boolean = false;
  #initValue: Group[] = [];

  ngOnInit(): void {
    this.#initValue = structuredClone(this.value);
    this.currentGroup = this.value[0] || {};
  }

  ngOnChanges({value}: SimpleChanges): void {
    if(value) this.value = structuredClone(value.currentValue);
  }

  /**
   * 取得使用者當前點選到的group
   * @param group 點選到的group
   */
  onGroupClick(group: Group) {
    this.subGroups = [];
    this.value = structuredClone(this.#initValue);
    this.currentGroup = group;
  }

  /**
   * 取得有被勾選到的subGroup，並顯示底下的item
   * @param subGroup 點選到的subGroup checkbox
   */
  onSubGroupClick(subGroup: SubGroup) {
    if (subGroup.isChecked) {
      this.subGroups.push(subGroup);
    } else {
      const index = this.subGroups.indexOf(subGroup);
      if (index !== -1) {
        this.subGroups.splice(index, 1);
      }
    }
  }

  /**
   * 將點選到的 item 加到購物車中
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  addCartClick(coding: Coding, group: Group, subGroup?: SubGroup) {
    this.#addItem(coding, group, subGroup);
  }

  /**
   * 將購物車中的 item，拿掉
   * @param cartItem 點選到購物車中的 item
   */
  removeCartClick(cartItem: CartItem) {
    const index = this.cartItems().indexOf(cartItem);
    if (index !== -1) this.cartItems.mutate(a => a.splice(index, 1));
  }

  /**
   * 點選ok，將購物車的 item去掉title，並送出去
   */
  onOkClick() {
    this.addCart.emit(this.cartItems().map((i) => i.item));
  }

  /**
   * 將搜尋bar輸入的字串送出去給外部撈取資料
   */
  onSearch() {
    if (this.keyword !== '') {
      this.search.emit(this.keyword);
      this.isSearch = this.isSearch || !this.isSearch;
    }
  }

  /**
   * 搜尋bar取消搜尋，將原先導覽的方式放回來
   */
  onSearchCancel() {
    this.isSearch = this.isSearch && !this.isSearch;
    this.keyword = '';
    this.value = this.#initValue;
  }

  /**
   * 將點選到的 item 加到購物車中的私有方法
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  #addItem(coding: Coding, group: Group, subGroup?: SubGroup): void {
    const itemTilte = group.groupName.concat(subGroup ? `>${subGroup.subGroupName}` : "");
    this.cartItems.mutate(a => a.push({
      title: itemTilte,
      item: coding
    }));
    this.cartItems.update(a => a.distinct((v) => v.item.code))
  }
}
