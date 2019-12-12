import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import buildQuery from 'odata-query';

@Injectable({
  providedIn: 'root'
})

export class OdataQueryBuilderService {
  stringFilterOptions: Object = {
      'equals': '{0} eq \'{1}\'' ,
      'not-equals': '{0} ne \'{1}\'',
      'in': '{0} eq \'{1}\'',
      'case-insensitive-equals': 'tolower({0}) eq tolower(\'{1}\')',
      'case-insensitive-not-equal': 'tolower({0}) ne tolower(\'{1}\')',
      'startswith': 'startswith({0}, \'{1}\') eq true',
      'startswith-false': 'startswith({0}, \'{1}\') eq false',
      'endswith': 'endswith({0}, \'{1}\') eq true',
      'endswith-false': 'endswith({0}, \'{1}\') eq false',
      'contains': 'contains({0},\'{1}\')',
      'length': 'length({0}) eq \'{1}\''
  };
  dateTimeFilterOptions = {
    'date_equals_datetime': 'year({0}) eq {1} and month({0}) eq {2} and day({0}) eq {3}',
    'before_date_datetime': '{0} lt {1}',
    'after_date_datetime': '{0} gt {1}',
    'before_select': '{0} le {1}',
    'after_select': '{0} ge {1}',
    'year_equals_int': 'year({0}) eq {1}',
    'month_number': 'month({0}) eq {1}',
    'day_number': 'day({0}) eq {1}',
    'hour_equals_int': 'hour({0}) eq {1}',
    'minute_equals_int': 'minute({0}) eq {1}',
    'second_equals_int': 'second({0}) eq {1}'
  }
  constructor(private http: HttpClient) { }

  // 获取根据当前时间计算的时间
  getWhereQueryDate(value) {
    var time = new Date();
    var now = new Date();
    switch (parseInt(value)) {
      case 0: // now
        break;
      case 1: // yesterday
        time.setDate(now.getDate() - 1);
        break;
      case 2: // a week ago
        time.setDate(now.getDate() - 7);
        break;
      case 3: // a month ago
        time.setMonth(now.getMonth() - 1);
        break;
      case 4: // tomorrow
        time.setDate(now.getDate() + 1);
        break;
      case 5: // next week
        time.setDate(now.getDate() + 7);
        break;
      case 6: // next month
        time.setMonth(now.getMonth() + 1);
        break;
    }
    return time.toISOString();
  }
  // 递归拼接
  recursionFilter(group) {
    let whereCondition = '';
    if (group.children && group.children.length > 0 ) {
      group.children.forEach((inner, index) =>{
        let type = '';
        if (index !== 0) {
          type = ' ' + group.queryType + ' ';
        }
        if (inner.operator && inner.column && inner.value) {
          if(inner.colunmType == 'string' || inner.colunmType == 'number') {
            let whereStr = this.stringFilterOptions[inner.operator];
            whereStr = whereStr.replace('{0}', inner.column);
            whereStr = whereStr.replace('{1}', inner.value);
            whereCondition +=  type + whereStr;
          }
          if(inner.colunmType == 'date') {
            let whereStr = this.dateTimeFilterOptions[inner.operator];
            whereStr = whereStr.replace(/\{0\}/g, inner.column);
            if(inner.operator == 'date_equals_datetime') {
              let year = new Date(inner.value).getFullYear();
              let month = new Date(inner.value).getMonth() - 1;
              let day = new Date(inner.value).getDay();
              whereStr = whereStr.replace('{1}', year);
              whereStr = whereStr.replace('{2}', month);
              whereStr = whereStr.replace('{3}', day);
            } else if (inner.operator == 'before_select' || inner.operator == 'before_select') {
              let date = this.getWhereQueryDate(inner.value);
              whereStr = whereStr.replace('{1}', date);
            }else if (inner.operator == 'year_equals_int' || inner.operator == 'month_number'
              || inner.operator == 'day_number' || inner.operator == 'hour_equals_int' || inner.operator == 'minute_equals_int' || inner.operator == 'second_equals_int') {
              whereStr = whereStr.replace('{1}', inner.value);
            } else {
              let date = new Date(inner.value).toISOString();
              whereStr = whereStr.replace('{1}', date);
            }
            whereCondition +=  type + whereStr;
          }
        }
      });
    }
    if (group.group && group.group.length > 0) {
      group.group.forEach(inner => {
        whereCondition += ' ' + group.queryType  + ' (' + this.recursionFilter(inner) + ')';
      });
    }
    return whereCondition;
  }
  queryBuilder(queryArr) {
    let queryStr;
    queryStr = this.recursionFilter(queryArr);
    return queryStr;
  }

  // 获取排序的字段
  getSorts(sorts) {
    const sortColumns = sorts.map(item =>{
      return item.name + ' ' + item.sort;
    })
    if (sortColumns.length == 0) {
      return null;
    }
    return sortColumns || null;
  }

  // 获取查询的字段
  joinColumn(columns) {
    const selectColumns = columns.map(item =>{
      return item.name;
    })
    if (selectColumns.length == 0) {
      return null;
    }
    return selectColumns || null;
  }

  getDay(day) {
    const today = new Date();
    const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    return new Date(targetday_milliseconds);
  }
}
