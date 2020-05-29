(function(window){
  var PETS = document.getElementById('pets-zone');
  if(POST.shop.HIDE){
    document.getElementById('shop').style.display = 'none';
    window.ChosenPet = -1;
    return;
  }
  var SHOP_SCROLL = (()=>{
    let result = {

    };
    result.main = document.getElementById('shop-scroll');
    result.left = result.main.children[0];
    result.right = result.main.children[1];
    result.pos = 0;
    result.length = 1;
    result.dot = [];
    result.reset = function(size,shop){
      result.Shop = shop;
      result.pivot = shop.children[0];
      result.pivot.style.transition = '.4s';
      result.pivot.style.marginLeft = '0px';
      result.length = size;
      result.pos = 0;
      result.dot = new Array(size).fill(0).map((x,i)=>{
        let div = document.createElement('DIV')
        div.classList.add('dot');
        if(i == 0) div.classList.add('dotOn');
        return div;
      });
      result.main.innerHTML = '';
      result.main.appendChild(result.left);
      result.dot.forEach((item) => {
        result.main.appendChild(item);
      });
      result.main.appendChild(result.right);
      result.right.onclick();
      result.left.onclick();
    }
    result.left.onclick = function(){
      if(this.pos <= 1){
        this.left.classList.remove('arrOn');
      }
      if(this.pos > 0){
        this.pos --;
        this.pivot.style.marginLeft = (-99*this.pos)+'%';
        for(let i in this.dot){
          if(i == this.pos){
            this.dot[i].classList.add('dotOn');
          } else {
            this.dot[i].classList.remove('dotOn');
          }
        }
      }
      if(this.pos < this.length-1){
        this.right.classList.add('arrOn');
      }
    }.bind(result);
    result.right.onclick = function(){
      if(this.pos >= this.length-2){
        this.right.classList.remove('arrOn');
      }
      if(this.pos < this.length-1){
        this.pos ++;
        this.pivot.style.marginLeft = (-99*this.pos)+'%';
        for(let i in this.dot){
          if(i == this.pos){
            this.dot[i].classList.add('dotOn');
          } else {
            this.dot[i].classList.remove('dotOn');
          }
        }
      }
      if(this.pos > 0){
        this.left.classList.add('arrOn');
      }
    }.bind(result);
    ///
    return result;
  })()
  const CONST = {
    RESOLUTION: 1.1,
    OFFCAN:     1.2,
    LINEWIDTH: 4,
    SMOOTH: 0.15,
    SIZE: 35,
    MOUSEDELAY: 60/15,
    MOUSE_OUT: 3,
    UP_ORDER:[
      7,
      1,
      6,
      2,
      0,
      4,
      5,

      3
    ]
  };
  let PETS_POS = 0;
  let zoneWidth = 280;
  var rnbcolor = ['hsl(0,100%,50%)','hsl(0,100%,30%)'];
  let C = {
    //         ---light------Dark---
    green:     ["#19e56e","#14ad54"],
    red:       ["#e6584b","#a9443b"],
    yellow:    ["#f4e433","#cab810"],
    blue:      ["#408edd","#3b6fa9"],
    gray:      ["#8e8ca5","#716e86"],//canons
    special:   rnbcolor,
    black:     ['#4a4a50','#1a1a1a'],
    white:     ['#f2f2f2','#e1e1e1'],
    lila:      ['#e0bbe4','#957dad'],
    necro:     ['#e5bd56','#b89337'],
    Grid:      ["#d0cdcd","#c1bebe"],

    hit:       ['#d82626','#d82626'],//red when you get hitted
    bull:      ["#999999","#6a6a6a"],
    sqr:       ["#cfcf9f","#a6a689"],
    alphaSqr:  ["#cfcf9f","#a6a689"],
    tri:       ["#d1adb2","#a38a8e"],
    alphaTri:  ["#d1adb2","#a38a8e"],
    pnt:       ["#b2b2cc","#8686ab"],
    alphaPnt:  ["#b2b2cc","#8686ab"],
    botName:    '#f6f1b5',
    up:[
      '#e6ab22',///Reload
      '#4bd79d',///M Speed
      '#e66a22',///BodyDamage
      '#4fd3d3',
      '#eddd2a',
      '#4a6dd8',
      '#e62222',
      '#50a5dc'
    ],
    class:[
      '#cd9797',
      '#cdc497',
      '#a9cd97',
      '#97bbcd',
      '#b9b5ce',
      '#ceb5ce',
      '#ceb5bd'
    ],
  };
  window.ChosenPet = -1;
  var Mess = (()=>{
    var messbox = document.getElementById('messages'),
        prevent = document.getElementById('prevent_click');
    var valid_svg = messbox.children[0],
        warn_svg = messbox.children[1],
        abort_svg = messbox.children[2],
        innerText = messbox.children[3];
    ///
    function add(elem,$1 = 0){
      if($1) elem.classList.add($1);
    }
    function remove(elem,$1 = 0){
      if($1) elem.classList.remove($1);
    }
    function toggle(elem,$1 = 0,$2 = 0,force = 0){
      if(force){
        if(force>0){
          if($1) elem.classList.add($1);
          if($2) elem.classList.remove($2);
        } else if(force<0) {
          if($1) elem.classList.remove($1);
          if($2) elem.classList.add($2);
        }
      } else {
        if($1) elem.classList.toggle($1);
        if($2) elem.classList.toggle($2);
      }
      return elem;
    }
    ///
    function send(type,text,stay = 0){
      toggle(prevent,0,'hide-prevent',1);
      toggle(messbox,'show-message','hide-message',1)
      switch(type){
        case 'valid':{
          toggle(valid_svg,'hide-svg','show-svg',-1);
          toggle(warn_svg,'hide-svg','show-svg',1);
          toggle(abort_svg,'hide-svg','show-svg',1);
          break;
        }
        case 'abort':{
          toggle(valid_svg,'hide-svg','show-svg',1);
          toggle(warn_svg,'hide-svg','show-svg',1);
          toggle(abort_svg,'hide-svg','show-svg',-1);
          break;
        }
        case 'warn':{
          toggle(valid_svg,'hide-svg','show-svg',1);
          toggle(warn_svg,'hide-svg','show-svg',-1);
          toggle(abort_svg,'hide-svg','show-svg',1);
          break;
        }
        case 'none':
        default:{
          toggle(valid_svg,'hide-svg','show-svg',1);
          toggle(warn_svg,'hide-svg','show-svg',1);
          toggle(abort_svg,'hide-svg','show-svg',1);
          break;
        }
      }
      innerText.innerHTML = text;
      if(!stay){
        prevent.onclick = function(){
          toggle(prevent,'hide-prevent',0,1);
          toggle(messbox,'show-message','hide-message',-1);
        }
      }
    }
    ///
    return {
      send: send,
    }
  })()
  function Buy(c,i,force = 0){
    if(force || POST.shop && POST.shop[c] && POST.shop[c][i] && POST.shop[c][i].price<= UserData.coins){
      Mess.send('none','Processing the request...',1)
      var Req = new XMLHttpRequest();
      ///
      Req.onload = function(Mess){
        switch(this.responseText){
          case 'already':{
            Mess.send('warn',"You are already buying something.",1);
            break;
          };
          case 'no obj':{
            Mess.send('abort',"Couldn't find the item.",0)
            break;
          };
          case 'owned':{
            Mess.send('warn',"You already have this item",0)
            break;
          };
          case 'no coins':{
            Mess.send('abort','You need more coins !')
            break;
          };
          case 'no user':{
            Mess.send('abort','The account is unvalid.');
            break;
          };
          default:{
            if(!this.responseText || !this.responseText.length){
              Mess.send('abort',"The action couldn't be done.");
              break;
            }
            var data;
            try {
              data = JSON.parse(this.responseText);
            } catch {
              Mess.send('abort',"The action couldn't be done.");
              break;
            }
            Mess.send('valid','Item purchased successfully.');
            window.UserData = data;
            document.getElementById('coin-data').innerHTML = data.coins;
            if(data.own) SetPets(data.own.pets);
          }
        }
      }.bind(Req,Mess);
      ///
      Req.onerror = Req.onabort = function(){
        this.send('abort',"The action couldn't be done.");
      }.bind(Mess);
      Req.open("post", "/buy", true);
      Req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      Req.send(`userKey=${POST.key}&id=${i}&class=${c}`);
    } else {
      Mess.send('warn','You need more coins !')
      return;
    }
  }
  window.testBuy = Buy;
  function spacify(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  ///
  let clone = PETS.children[0].cloneNode(true);
  PETS.innerHTML = '';
  for(let i in POST.shop.pets){
    if(isNaN(parseInt(i))) continue;
    let can = document.createElement('CANVAS');
    let ctx = can.getContext('2d');
    can.width = can.height = 70;
    ctx.setTransform(1,0,0,1,can.width/2,can.height/2);
    let param = {
      size: 35,
      type: i,
      color: 'green',
      dir:   -Math.PI/4,
      alpha: 1
    }
    PetsConfig.pets[i](ctx,param,CONST,C);
    switch(parseInt(i)){
      case 1:
      case 2:
      case 3:
      case 4:{
        can.onload = function(){
          ctx.clearRect(-this.width/2,-this.height/2,this.width,this.height);
          ctx.setTransform(1,0,0,1,can.width/2,can.height/2);
          PetsConfig.pets[i](ctx,param,CONST,C);
          requestAnimationFrame(this.onload);
        }.bind(can);
        can.onload();
        break;
      }
    }
    ///
    let itDiv = clone.cloneNode(1);
    itDiv.children[0].onclick = function(itemId){
      if(this.owned){
        for(let i in PETS.children){
          if(PETS.children[i].children && i != itemId) PETS.children[i].children[0].classList.remove('item-select');
        }
        this.classList.toggle('item-select');
        ChosenPet = itemId;
      } else {
        Buy('pets',itemId)
      }
    }.bind(itDiv.children[0],i)
    itDiv.children[0].children[0].innerHTML = POST.shop.pets[i].label
    itDiv.children[0].children[1].appendChild(can);
    itDiv.children[0].children[2].children[0].innerHTML = spacify(POST.shop.pets[i].price)
    PETS.appendChild(itDiv)
  }
  window.SetPets = function(owned){
    if(!owned){return}
    for(let item in owned){
      PETS.children[item].children[0].owned = true;
      let div = PETS.children[item].children[0].children[2];
      div.children[0].innerHTML = '<span style="color: #aab; font-size: 1em;">Owned</span>';
      div.children[1].style.display = 'none';
    }
  }
  SHOP_SCROLL.reset(2,PETS);
  ///
})(window);
