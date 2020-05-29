
function selectGM(gm){
  var elem = document.getElementById('gamemode-box').getElementsByClassName('button');
  State = gm;
  switch(gm){
    case 'ffa':{
      elem[0].classList.remove('deactivated');
      elem[1].classList.add('deactivated');
      elem[2].classList.add('deactivated');
      break;
    }
    case '2team':{
      elem[0].classList.add('deactivated');
      elem[1].classList.remove('deactivated');
      elem[2].classList.add('deactivated');
      break;
    }
    case '4team':{
      elem[0].classList.add('deactivated');
      elem[1].classList.add('deactivated');
      elem[2].classList.remove('deactivated');
      break;
    }
  };
};

function play(){
  let form = document.createElement('FORM');
  form.method = 'post';
  form.action = '/play';
  let key = document.createElement('INPUT');
  key.type = 'hidden';
  key.value = POST.key;
  key.name = 'key'
  let name = document.createElement('INPUT');
  name.type = 'hidden';
  name.value = document.getElementById('in-game-name').value || 'unnamed';
  name.name = 'name';
  let gm = document.createElement('INPUT');
  gm.type = 'hidden';
  gm.value = State;
  gm.name = 'gm';
  let pet = document.createElement('INPUT');
  pet.type = 'hidden';
  pet.value = ChosenPet;
  pet.name = 'pet';
  form.appendChild(pet);
  form.appendChild(key);
  form.appendChild(name);
  form.appendChild(gm);
  document.body.appendChild(form);
  //console.log(form);
  form.submit();
}

window.onload = function(){
  window.UserData = {};
  try {
    window.Pref = JSON.parse(decodeURIComponent((function(name) {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
    })('preference')).slice(2));
    if(Pref.name && Pref.name.length){
      document.getElementById('in-game-name').value = Pref.name;
    }
  } catch {
    window.Pref = {};
  }
  var Req = new XMLHttpRequest();
  Req.onload = function(){
    var data = 0
    try{
      data = window.UserData = JSON.parse(this.responseText);
    } catch {

    }
    if(!data){
      data = window.UserData = {coins:0};
    }
    document.getElementById('coin-data').innerHTML = data.coins;
    if(UserData.own && UserData.own.pets) {
      SetPets(UserData.own.pets);
      if(UserData.own.pets[window.Pref.pet]){
        ChosenPet = Pref.pet;
        document.getElementById('pets-zone').children[ChosenPet].children[0].classList.toggle('item-select');
        for(let i = 0; i<parseInt(ChosenPet/3); i++){
          let s = document.getElementById('shop-scroll');
          s.children[s.children.length-1].onclick();
        }
      }
    }
  };
  Req.open("post", "/userData", true);
  Req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  Req.send('userKey='+POST.key);
  //
  var toggleLB = (()=>{
    let box = document.createElement('DIV');
    box.id = 'leadeBox';
    box.classList.add('white-box','hideDiv');
    box.innerHTML = '<h1>Obstar Top Scores</h1>';
    let info = document.createElement('DIV');
    info.classList.add('leader','leaderinfo');
    info.innerHTML =
    `<div class='pos'> <br/> </div>`+
    `<div class='name'> Tank Name </div>`+
    `<div class='score'> Score </div>`+
    `<div class='class'> Tank </div>`+
    `<div class='gm'> Game Mode </div>`+
    `<div class='date'> Date </div>`;
    box.appendChild(info);
    let leadZone = document.createElement('DIV');
    leadZone.classList.add('leadZone');
    box.appendChild(leadZone);
    document.body.appendChild(box);
    function escapeHtml(html){
      var text = document.createTextNode(html);
      var p = document.createElement('p');
      p.appendChild(text);
      return p.innerHTML;
    }
    POST.leader.forEach((item,i) => {
      let leader = document.createElement('DIV');
      leader.classList.add('leader',((item.userKey == POST.key) ? 'isMe' : 'notme'));
      let is = '';
      if(item.userKey == POST.key){
        is='isMe';
      }
      leader.innerHTML =
      `<div class='pos'> ${i+1} </div>`+
      `<div class='name'> ${escapeHtml(item.name)} </div>`+
      `<div class='xp'> ${item.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </div>`+
      `<div class='class'> ${item.tank} </div>`+
      `<div class='gm'> ${item.gm}</div>` +
      `<div class='date'> ${item.date} </div>`;
      leadZone.appendChild(leader);
    });
    return ()=>{
      box.classList.toggle('showDiv');
      box.classList.toggle('hideDiv');
      var prevent = document.getElementById('prevent_click');
      prevent.classList.toggle('hide-prevent');
      prevent.onclick = function(){
        box.classList.toggle('showDiv');
        box.classList.toggle('hideDiv');
        prevent.classList.toggle('hide-prevent');
      }
    }
  })();

  document.getElementById('play-button').focus();
  document.getElementById('Lead').onclick = toggleLB;
  resize();
  requestAnimationFrame(loop);
};
