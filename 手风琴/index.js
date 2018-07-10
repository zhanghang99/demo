let arr = [
  {
    name:'HTML',
    list:[
      {
        title:'111',
        url:'http://www.baidu.com'
      },
      {
        title:'222',
        url:'http://www.baidu.com'
      },
    ]
  },
  {
    name:'JS',
    list:[
      {
        title:'111',
        url:'http://www.baidu.com'
      },
      {
        title:'222',
        url:'http://www.baidu.com'
      },{
        title:'333',
        url:'http://www.baidu.com'
      },
    ]
  },
  {
    name:'CSS',
    list:[
      {
        title:'111',
        url:'http://www.baidu.com'
      },
      {
        title:'222',
        url:'http://www.baidu.com'
      },
      {
        title:'我们都一样',
        url:'http://www.baidu.com'
      },
    ]
  },
];

//页面初始化根据数据生成元素
let ulDom = document.querySelector(".main");
ulDom.innerHTML = createDom(arr);

//元素展开和收起
ulDom.onclick = function(e){
  stretch(e);
}

//点击搜索
search.onclick = function(){
  searchs();
}

//回车键搜索
document.onkeydown = function(e){
  e.keyCode === 13 && searchs();
}

//列表展开和搜索
function stretch(e){
  let liDomName = e.target.className;
  if(liDomName === 'Menus'){
    let ulDomName = e.target.querySelector('ul').className;
    if(ulDomName.length === 0){
      e.target.querySelector('ul').className = 'show';
    }else if(ulDomName.length !== 0){
      e.target.querySelector('ul').className = ''
    }
  }
}

//搜索
function searchs(){
  let keywords = document.querySelector('.keywords').value;
  let arr1 = [];
  console.log(arr);
  arr.forEach((val)=>{
    let childArr = [];
    childArr = val.list.filter((v)=>{
      return v.title.indexOf(keywords) !== -1;
    })
    childArr.length !== 0 && arr1.push({name:val.name,list:childArr})
  })
  ulDom.innerHTML = createDom(arr1, keywords.length === 0 ? '' : 'show', keywords);
}

//生成Dom元素
function createDom(arrs,names,keywords){
  let html = '';
  arrs.forEach((val)=>{
    let childHtml = `<ul class='${names}'>`;
    val.list.forEach((v)=>{
      let reg = new RegExp("(" + keywords + ")", "ig");
      let title = names ? v.title.replace(reg,`<span>${keywords}</span>`) : v.title;
      childHtml += `<li><a href='${v.url}'>${title}</a></li>`
    })
    childHtml += `</ul>`;
    html += `<li class='Menus'>${val.name}${childHtml}</li>`
  })
  // debugger;
  return html;
}

