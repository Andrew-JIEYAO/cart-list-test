import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Signal, SimpleChanges, WritableSignal, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, Coding, Group, MenuItem, ItemKey, SubGroup } from './cart-list.interface';
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

  @Output() addCart = new EventEmitter<Coding[]>();
  @Output() search = new EventEmitter<string>;
  @Output() getMenuItem = new EventEmitter<ItemKey>;
  @Input() groupValue: Group[] = [];
  @Input() searchValue: MenuItem[] = []

  #itemValue: MenuItem = {} as MenuItem;
  @Input()
  set itemValue(value: MenuItem) {
    this.#setItemPool(value);
    this.#itemValue = value;
  }
  get itemValue(): MenuItem {
    return this.#itemValue;
  }

  itemPool: Map<string, MenuItem> = new Map();
  menuItems: MenuItem[] = [];
  currentGroup: Group = {} as Group;

  cartItems: WritableSignal<CartItem[]> = signal([]);
  groupItems: Signal<Record<string, CartItem[]>> = computed(() => this.cartItems().groupBy(v => v.title));
  groupTitles: Signal<string[]> = computed(() => Object.keys(this.groupItems()));

  keyword: string = '';
  isSearch: boolean = false;

  ngOnInit(): void {
    this.currentGroup = this.groupValue[0] || {};
  }

  /**
   * 取得使用者當前點選到的group
   * @param group 點選到的group
   */
  onGroupClick(group: Group) {
    if (this.currentGroup !== group) {
      this.menuItems = [];
      if (this.currentGroup.subGroups) this.currentGroup.subGroups.map((s) => s.isChecked = false);
      if (!group.subGroups) this.#getManuItem(group);
      this.currentGroup = group;
    }
  }

  /**
   * 取得有被勾選到的subGroup，並顯示底下的item
   * @param subGroup 點選到的subGroup checkbox
   */
  onSubGroupClick(group: Group, subGroup: SubGroup) {
    if (subGroup.isChecked) {
      this.#getManuItem(group, subGroup);
    } else {
      const index = this.menuItems.indexOf(this.itemPool.get(`${group.info.code}${subGroup.info.code}`)!);
      if (index !== -1) {
        this.menuItems.splice(index, 1);
      }
    }
  }

  /**
   * 將點選到的 item 加到購物車中
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  addCartClick(item: Coding, group: Coding, subGroup?: Coding) {
    this.#addCartItem(item, group.display.concat(subGroup ? `>${subGroup.display}` : ""));
  }

  /**
   * 將購物車中的 item，拿掉
   * @param cartItem 點選到購物車中的 item
   */
  deleteCartClick(cartItem: CartItem) {
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
   * 將點選到的 item 加到購物車中的私有方法
   * @param coding 點選到的item
   * @param group 該 item 的 group
   * @param subGroup 該 item 的 subGroup 有可能不存在
   */
  #addCartItem(item: Coding, title: string): void {
    this.cartItems.mutate(a => a.push({
      title: title,
      item: item
    }));
    this.cartItems.update(a => a.distinct((v) => v.item.code))
  }

  /**
   *
   * @param group
   * @param subGroup
   */
  #getManuItem(group: Group, subGroup?: SubGroup) {
    const key = `${group.info.code}${subGroup ? subGroup.info.code : ''}`;
    if (!this.itemPool.has(key)) {
      this.getMenuItem.emit(subGroup
        ? { groupCode: group.info.code, subGroupCode: subGroup.info.code }
        : { groupCode: group.info.code });
    } else {
      this.menuItems.push(this.itemPool.get(key)!);
    }
  }

  /**
   *
   * @param menuItem
   */
  #setItemPool(menuItem: MenuItem) {
    const group = menuItem.group;
    const subGroup = menuItem.subGroup;
    this.itemPool.set(group.code.concat(subGroup ? subGroup.code : ''), menuItem)
    this.menuItems.push(menuItem);
  }
}
