import { Component, EventEmitter, Input, OnInit, Output, Signal, WritableSignal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, Coding, Group, MenuItem, ItemKey } from './cart-list.interface';
import { FormsModule } from '@angular/forms';
import "@his-base/array-extension";
import "@his-base/string-extention";

@Component({
  selector: 'his-cart-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  @Output() addCart = new EventEmitter<Coding[]>();
  @Output() search = new EventEmitter<string>;
  @Output() getMenuItem = new EventEmitter<ItemKey>;
  @Input() groupValue: Group[] = [];
  @Input() searchValue: MenuItem[] = [];
  @Input()
  set itemValue(value: MenuItem) {
    if (value.group) {
      this.#setItemPool(value);
      this.#itemValue = value;
    }
  }
  get itemValue(): MenuItem {
    return this.#itemValue;
  }

  itemPool: Map<string, MenuItem> = new Map();
  itemKeys: ItemKey[] = [];
  currentGroup: Group = {} as Group;

  cartItems: WritableSignal<CartItem[]> = signal([]);
  groupItems: Signal<Record<string, CartItem[]>> = computed(() => this.cartItems().groupBy(v => v.title));
  groupTitles: Signal<string[]> = computed(() => Object.keys(this.groupItems()));

  keyword: string = '';
  isSearch: boolean = false;

  #itemValue: MenuItem = {} as MenuItem;

  ngOnInit(): void {
    this.currentGroup = this.groupValue[0] || {};
  }

  /**
   * 點選到group觸發的事件
   * 清空前一個group底下的subGroup的check
   * 處理大池子itemPool
   * 處理決定顯不顯示的陣列menuKeys
   * @param group 點選到的group
   */
  onGroupClick(group: Group) {
    this.itemKeys = [];
    if (this.currentGroup.subGroups) this.currentGroup.subGroups.map((s) => s.isChecked = false);
    this.currentGroup = group;
    if (group.subGroups) return;
    this.itemPool.has(group.info.code) || this.getMenuItem.emit({ group: group.info });
    this.itemKeys.push({ group: group.info });
  }

  /**
   * 點選到subGroup觸發的事件
   * 處理大池子itemPool
   * 處理決定顯不顯示的陣列menuKeys
   * @param subGroup 點選到的subGroup checkbox
   */
  onSubGroupClick(group: Coding, subGroup: Coding) {
    const key = this.parseKey({ group, subGroup });
    const index = this.itemKeys.findIndex((i) => key.equals(this.parseKey(i)));
    if (index !== -1 && this.itemKeys.splice(index, 1).length) return;
    if (!this.itemPool.has(key)) this.getMenuItem.emit({ group, subGroup });
    this.itemKeys.push({ group, subGroup });
  }

  /**
   * 將點選到的 item 加到購物車中
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  onAddCart(item: Coding, group: Coding, subGroup?: Coding) {
    this.#addCartItem(item, group.display.concat(subGroup ? `>${subGroup.display}` : ""));
  }

  /**
   * 將購物車中的 item，拿掉
   * @param cartItem 點選到購物車中的 item
   */
  onRemoveCart(cartItem: CartItem) {
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
  }

  /**
   * 從畫面上的group與subGroup去拿取相對應的item
   * @param menuKey
   * @returns
   */
  getItemFromPool(itemKey: ItemKey): Coding[] {
    const key = this.parseKey(itemKey);
    return this.itemPool.get(key)?.infos || [];
  }

  /**
   * 將含有group與subGroup的ItemKey轉換成從池子撈取item的key
   * @param key
   * @returns
   */
  parseKey(key: ItemKey): string {
    const { group, subGroup } = key;
    return group.code.concat(subGroup?.code || '');
  }

  /**
   * 將點選到的 item 加到購物車中的私有方法
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  #addCartItem(item: Coding, title: string): void {
    this.cartItems.mutate(a => a.push({ title, item }));
    this.cartItems.update(a => a.distinct((v) => v.item.code))
  }

  /**
   * 將外面撈取回來的item放進池子中
   * @param menuItem
   */
  #setItemPool(menuItem: MenuItem) {
    const group = menuItem.group;
    const subGroup = menuItem.subGroup;
    this.itemPool.set(group.code.concat(subGroup?.code || ''), menuItem);
  }
}
