import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartListComponent } from "./cart-list/cart-list.component";
import { Coding, Group, MenuItem, ItemKey } from './cart-list/cart-list.interface';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, CartListComponent, ButtonModule, DialogModule]
})
export class AppComponent {

  title = 'cart-list-test';

  groupValue: Group[] = [
    {
      "info": {
        "code": "010",
        "display": "披薩"
      },
      "subGroups": [
        {
          "info": {
            "code": "011",
            "display": "個人披薩"
          },
          "isChecked": false
        },
        {
          "info": {
            "code": "012",
            "display": "經典口味"
          },
          "isChecked": false
        },
        {
          "info": {
            "code": "013",
            "display": "期間限定"
          },
          "isChecked": false
        }
      ]
    },
    {
      "info": {
        "code": "020",
        "display": "漢堡"
      },
      "subGroups": [
        {
          "info": {
            "code": "021",
            "display": "米漢堡"
          },
          "isChecked": false
        },
        {
          "info": {
            "code": "022",
            "display": "麵包漢堡"
          },
          "isChecked": false
        }
      ]
    },
    {
      "info": {
        "code": "030",
        "display": "其他點心"
      }
    }
  ];
  itemValues: MenuItem[] = [
    {
      "group": {
        "code": "010",
        "display": "披薩"
      },
      "subGroup": {
        "code": "011",
        "display": "個人披薩"
      },
      "infos": [
        {
          "code": "110",
          "display": "鐵板雙牛個人披薩"
        },
        {
          "code": "111",
          "display": "哈辣墨西哥個人披薩"
        },
        {
          "code": "112",
          "display": "夏威夷個人披薩"
        },
        {
          "code": "113",
          "display": "韓式泡菜燒肉個人披薩"
        }
      ]
    },
    {
      "group": {
        "code": "010",
        "display": "披薩"
      },
      "subGroup": {
        "code": "012",
        "display": "經典口味"
      },
      "infos": [
        {
          "code": "114",
          "display": "黃金咖哩海鮮披薩"
        },
        {
          "code": "115",
          "display": "日式照燒雞披薩"
        },
        {
          "code": "116",
          "display": "法式卡菲海陸披薩"
        },
        {
          "code": "117",
          "display": "煙燻培根手撕豬披薩"
        },
        {
          "code": "118",
          "display": "壽喜雪花牛披薩"
        }
      ]
    },
    {
      "group": {
        "code": "010",
        "display": "披薩"
      },
      "subGroup": {
        "code": "013",
        "display": "期間限定"
      },
      "infos": [
        {
          "code": "119",
          "display": "起司三重奏披薩"
        },
        {
          "code": "120",
          "display": "金玉時蔬披薩"
        },
        {
          "code": "121",
          "display": "日式味增鮭魚燒披薩"
        },
        {
          "code": "122",
          "display": "超級總匯披薩"
        }
      ]
    },
    {
      "group": {
        "code": "020",
        "display": "漢堡"
      },
      "subGroup": {
        "code": "021",
        "display": "米漢堡"
      },
      "infos": [
        {
          "code": "123",
          "display": "和風板烤雞腿米漢堡"
        },
        {
          "code": "124",
          "display": "義式雞腿米漢堡"
        },
        {
          "code": "125",
          "display": "美式厚牛米漢堡"
        }
      ]
    },
    {
      "group": {
        "code": "020",
        "display": "漢堡"
      },
      "subGroup": {
        "code": "022",
        "display": "麵包漢堡"
      },
      "infos": [
        {
          "code": "126",
          "display": "勁辣雞腿堡"
        },
        {
          "code": "127",
          "display": "大麥克堡"
        }
      ]
    },
    {
      "group": {
        "code": "030",
        "display": "其他點心"
      },
      "infos": [
        {
          "code": "101",
          "display": "烤雞拼盤"
        },
        {
          "code": "102",
          "display": "海陸大拼盤"
        },
        {
          "code": "103",
          "display": "黃金雞柳條"
        },
        {
          "code": "104",
          "display": "黃金波浪地瓜條"
        },
        {
          "code": "105",
          "display": "麻糬QQ球"
        },
        {
          "code": "106",
          "display": "薯金幣"
        }
      ]
    }
  ]

  itemValue: MenuItem = {} as MenuItem;
  searchValue: MenuItem[] = [];

  items: Coding[] = [];
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  async onSearch(keyword: string) {
    try {
      await this.#searchData(keyword);
    }
    catch (error) {
      console.log(error);
    }
  }

  onGetMenuItem(key: ItemKey) {
    // setTimeout(() => {
    //   this.itemValue = this.#getItem(pullKey)!;
    // }, 1000);
    this.itemValue = this.#getMenuItem(key)!;
  }

  onAddResult(result: Coding[]) {
    this.items = result;
    this.visible = false;
  }

  #searchData(query: string) {
    this.searchValue = [
      {
        "group": {
          "code": "020",
          "display": "漢堡"
        },
        "subGroup": {
          "code": "021",
          "display": "米漢堡"
        },
        "infos": [
          {
            "code": "123",
            "display": "和風板烤雞腿米漢堡"
          },
          {
            "code": "124",
            "display": "義式雞腿米漢堡"
          },
          {
            "code": "125",
            "display": "美式厚牛米漢堡"
          }
        ]
      },
      {
        "group": {
          "code": "030",
          "display": "其他點心"
        },
        "infos": [
          {
            "code": "101",
            "display": "烤雞拼盤"
          },
          {
            "code": "102",
            "display": "海陸大拼盤"
          },
          {
            "code": "103",
            "display": "黃金雞柳條"
          },
          {
            "code": "104",
            "display": "黃金波浪地瓜條"
          },
          {
            "code": "105",
            "display": "麻糬QQ球"
          },
          {
            "code": "106",
            "display": "薯金幣"
          }
        ]
      }
    ];
  }

  #getMenuItem(key: ItemKey): MenuItem | undefined {
    return this.itemValues.find((item) => {
      if(item.group.code === key.groupCode && (!key.subGroupCode || item.subGroup?.code === key.subGroupCode)) {
        return true;
      }
      return false;
    });
  }
}
