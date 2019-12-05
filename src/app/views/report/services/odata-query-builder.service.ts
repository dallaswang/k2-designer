import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import buildQuery from 'odata-query';

@Injectable({
  providedIn: 'root'
})

export class OdataQueryBuilderService {
  filterKey: Object = {
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
  constructor(private http: HttpClient) { }

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
          let whereStr = this.filterKey[inner.operator];
          whereStr = whereStr.replace('{0}', inner.column);
          whereStr = whereStr.replace('{1}', inner.value);
          whereCondition +=  type + whereStr;
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
    return sortColumns;
  }

  // 获取查询的字段
  joinColumn(columns) {
    const selectColumns = columns.map(item =>{
      return item.name;
    })
    return selectColumns;
  }
}
