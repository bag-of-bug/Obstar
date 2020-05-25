(function(exports, platform){

  exports.class = (platform == 'client') ?
  ///CLIENTS///
  {
    "Basic":{
      canons:[
        {
          type: 0,
          height:68,
          width: 32,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    ///
    "Twin":{
      canons:[
        {
          type: 0,
          height: 60,
          width: 27,
          offx: 17,
          offdir: 0,
          open: 0,
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: -17,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Rifle":{
      canons:[
          {
            type: 0,
            height: 62,
            width: 26,
            offx: 0,
            offdir: 0,
            open: 21
          }
        ],
      body:{
        shape: 0,
      }
    },
    "Sniper":{
      canons:[
          {
            type: 0,
            height:80,
            width: 30,
            offx: 0,
            offdir: 0,
            open: 0
          }
        ],
      body:{
        shape: 0,
      }
    },
    "Flank Guard":{
      canons:[
        {
          type: 0,
          height:65,
          width: 32,
          offx: 0,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height: 58,
          width: 30,
          offx: 0,
          offdir: Math.PI,
          open: 0
        },
        ///
      ],
      body:{
        shape: 0,
      }
    },
    ///
    "Triple":{
      canons:[
        {
          type: 0,
          height: 58,
          width: 27,
          offx: 6,
          offdir: .4,
          open: 0,
        },
        {
          type: 0,
          height: 58,
          width: 27,
          offx: -6,
          offdir: -.4,
          open: 0
        },
        {
          type: 0,
          height: 65,
          width: 28,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Twin Flank":{
      canons:[
        {
          type: 0,
          height: 60,
          width: 27,
          offx: 17,
          offdir: 0,
          open: 0,
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: -17,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: 17,
          offdir: Math.PI,
          open: 0,
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: -17,
          offdir: Math.PI,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Quad Shot":{
      canons:[
        {
          type: 0,
          height: 66,
          width: 27,
          offx: 0,
          offdir: 0,
          open: 0,
        },
        {
          type: 0,
          height: 66,
          width: 27,
          offx: 0,
          offdir: Math.PI/2,
          open: 0
        },
        {
          type: 0,
          height: 66,
          width: 27,
          offx: 0,
          offdir: Math.PI,
          open: 0
        },
        {
          type: 0,
          height: 66,
          width: 27,
          offx: 0,
          offdir: Math.PI*1.5,
          open: 0
        },
      ],
      body:{
        shape: 0,
      }
    },
    "Destroyer":{
      canons:[
        {
          type: 0,
          height:62,
          width: 48,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Assasin":{
      canons:[
          {
            type: 0,
            height:85,
            width: 30,
            offx: 0,
            offdir: 0,
            open: 0
          }
        ],
      body:{
        shape: 0,
      }
    },
    "Pilote":{
      canons:[
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: Math.PI/2,
          open: 23,
        },
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: -Math.PI/2,
          open: 23
        },
      ],
      body:{
        shape: 0,
      }
    },
    "Hover Tank":{
      canons:[
        {
          type: 0,
          height:62,
          width: 32,
          offx: 0,
          offdir: 0,
          open: 0
        },
        ///
        {
          type: 0,
          height: 58,
          width: 27,
          offx: -5,
          offdir: -Math.PI-.4,
          open: 0,
        },
        {
          type: 0,
          height: 58,
          width: 27,
          offx: 5,
          offdir: -Math.PI+.4,
          open: 0
        },
        ///
      ],
      body:{
        shape: 0,
      }
    },
    "Trapper":{
      canons:[
        {
          type: 1,
          height:65,
          width: 27,
          openlength: 16,
          offx: 0,
          offdir: 0,
          open: 18
        }
      ],
      body:{
        shape: 0,
      }
    },
    ///
    "Rocket":{
      canons:[
        {
          type: 0,
          height: 56,
          width: 27,
          offx: -5,
          offdir: -Math.PI-.4,
          open: 0,
        },
        {
          type: 0,
          height: 56,
          width: 27,
          offx: 5,
          offdir: -Math.PI+.4,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    'Hybrid':{
      canons:[
        {
          type: 0,
          height:62,
          width: 48,
          offx: 0,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: Math.PI,
          open: 23,
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Annihilator":{
      canons:[
        {
          type: 0,
          height:64,
          width: 70,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Sprayer":{
      canons:[
          {
            type: 0,
            height:82,
            width: 29,
            offx: 0,
            offdir: 0,
            open: 0
          },
          {
            type: 0,
            height:82-7,
            width: 29,
            offx: 0,
            offdir: 0,
            open: 0
          },
          {
            type: 0,
            height:82-7*2,
            width: 29,
            offx: 0,
            offdir: 0,
            open: 0
          },
          {
            type: 0,
            height:82-7*3,
            width: 29,
            offx: 0,
            offdir: 0,
            open: 0
          },
          {
            type: 0,
            height:82-7*4,
            width: 29,
            offx: 0,
            offdir: 0,
            open: 0
          },
        ],
      body:{
        shape: 0,
      }
    },
    "Ranger":{
      canons:[
          {
            type: 0,
            height:88,
            width: 30,
            offx: 0,
            offdir: 0,
            open: 0
          },
          {
            type: 0,
            height:45,
            width: 60,
            offx: 0,
            offdir: 0,
            open: -30
          }
        ],
      body:{
        shape: 0,
      }
    },
    "Booster":{
      canons:[
        {
          type: 0,
          height:62,
          width: 32,
          offx: 0,
          offdir: 0,
          open: 0
        },
        ///
        {
          type: 0,
          height: 52,
          width: 27,
          offx: -6,
          offdir: -Math.PI-.65,
          open: 0,
        },
        {
          type: 0,
          height: 52,
          width: 27,
          offx: 6,
          offdir: -Math.PI+.65,
          open: 0
        },
        ///
        {
          type: 0,
          height: 58,
          width: 27,
          offx: -5,
          offdir: -Math.PI-.35,
          open: 0,
        },
        {
          type: 0,
          height: 58,
          width: 27,
          offx: 5,
          offdir: -Math.PI+.35,
          open: 0
        },
        ///
      ],
      body:{
        shape: 0,
      }
    },
    "Raptor":{
      canons:[
        {
          type: 0,
          height:65,
          width: 32,
          offx: 0,
          offdir: 0,
          open: 0
        },
        ///
        {
          type: 0,
          height: 57,
          width: 27,
          offx: 1,
          offdir: -Math.PI/2,
          open: 0,
        },
        {
          type: 0,
          height: 57,
          width: 27,
          offx: -1,
          offdir: Math.PI/2,
          open: 0
        },
        ///
        {
          type: 0,
          height: 59,
          width: 27,
          offx: -5,
          offdir: -Math.PI-.4,
          open: 0,
        },
        {
          type: 0,
          height: 59,
          width: 27,
          offx: 5,
          offdir: -Math.PI+.4,
          open: 0
        },
        ///
      ],
      body:{
        shape: 0,
      }
    },
    "Auto Hover":{
      canons:[
        {
          type: 0,
          height:62,
          width: 32,
          offx: 0,
          offdir: 0,
          open: 0
        },
        ///
        {
          type: 0,
          height: 58,
          width: 27,
          offx: -5,
          offdir: -Math.PI-.4,
          open: 0,
        },
        {
          type: 0,
          height: 58,
          width: 27,
          offx: 5,
          offdir: -Math.PI+.4,
          open: 0
        },
        ///
      ],
      turrets:[
        {
          type: 0,
          height:38,
          width: 21,
          offx: 0,
          offdir: 0,
          open: 0,
          rad: 18
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Treble":{
      canons:[
        {
          type: 0,
          height: 55,
          width: 27,
          offx: 17,
          offdir: 0,
          open: 0,
        },
        {
          type: 0,
          height: 55,
          width: 27,
          offx: -17,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height: 60,
          width: 28,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Triple Twin":{
      canons:[
        {
          type: 0,
          height: 60,
          width: 27,
          offx: 17,
          offdir: 0,
          open: 0,
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: -17,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: 17,
          offdir: Math.PI*2/3,
          open: 0,
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: -17,
          offdir: Math.PI*2/3,
          open: 0
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: 17,
          offdir: Math.PI*4/3,
          open: 0,
        },
        {
          type: 0,
          height: 60,
          width: 27,
          offx: -17,
          offdir: Math.PI*4/3,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Penta Shot":{
      canons:[
        {
          type: 0,
          height: 55,
          width: 27,
          offx: 7,
          offdir: .6,
          open: 0,
        },
        {
          type: 0,
          height: 55,
          width: 27,
          offx: -7,
          offdir: -.6,
          open: 0
        },
        {
          type: 0,
          height: 63,
          width: 27,
          offx: 3,
          offdir: .3,
          open: 0,
        },
        {
          type: 0,
          height: 63,
          width: 27,
          offx: -3,
          offdir: -.3,
          open: 0
        },
        {
          type: 0,
          height: 69,
          width: 28,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Octo Shot":{
      canons:[
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: 0,
          open: 0,
        },
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: Math.PI/4,
          open: 0
        },
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: Math.PI*.5,
          open: 0
        },
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: Math.PI*.75,
          open: 0
        },
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: Math.PI,
          open: 0,
        },
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: Math.PI*1.25,
          open: 0
        },
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: Math.PI*1.5,
          open: 0
        },
        {
          type: 0,
          height: 62,
          width: 27,
          offx: 0,
          offdir: Math.PI*1.75,
          open: 0
        },
      ],
      body:{
        shape: 0,
      }
    },
    "Cyclone":{
      canons:[
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: 0,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*.2,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*0.4,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*.6,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*.8,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*1,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*1.2,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*1.4,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*1.6,
            open: 0
          },
          {
            type: 0,
            height:52,
            width: 20,
            offx: 0,
            offdir: Math.PI*1.8,
            open: 0
          },
        ],
      body:{
        shape: 0,
      }
    },
    "Autocrat":{
      canons:[
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: 0,
          open: 23,
        },
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: Math.PI/2,
          open: 23
        },
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: Math.PI,
          open: 23
        },
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: Math.PI*3/2,
          open: 23
        },
      ],
      body:{
        shape: 0,
      }
    },
    "Necromancer":{
      canons:[
        {
          type: 0,
          height: 52,
          width: 23,
          offx: 0,
          offdir: Math.PI/2,
          open: 28,
        },
        {
          type: 0,
          height: 52,
          width: 23,
          offx: 0,
          offdir: -Math.PI/2,
          open: 28
        },
      ],
      body:{
        shape: 1,
        height:1.05,
        width: .95,
      },
      ups:[
        'Health Regen',
        'Drone Count',
        'Max Health',
        'Bullet Speed',
        'Movement Speed',
        'Bullet Damage',
        'Body Damage',
        'Bullet Penetration'
      ]
    },
    "Predator":{
      canons:[
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: 0,
          open: 23,
        },
      ],
      body:{
        shape: 0,
      }
    },
    "BattleShip":{
      canons:[
        {
          type: 0,
          height: 48,
          width: 33,
          offx: 12,
          offdir: Math.PI/2,
          open: -16,
        },
        {
          type: 0,
          height: 48,
          width: 33,
          offx: -12,
          offdir: -Math.PI/2,
          open: -16
        },
        {
          type: 0,
          height: 48,
          width: 33,
          offx: -12,
          offdir: Math.PI/2,
          open: -16,
        },
        {
          type: 0,
          height: 48,
          width: 33,
          offx: 12,
          offdir: -Math.PI/2,
          open: -16
        },
      ],
      body:{
        shape: 0,
      }
    },
    "Fortress":{
      canons:[
        {
          type: 1,
          height:65,
          width: 27,
          openlength: 15,
          offx: 0,
          offdir: 0,
          open: 14
        },
        {
          type: 1,
          height:65,
          width: 27,
          openlength: 15,
          offx: 0,
          offdir: Math.PI*2/3,
          open: 14
        },
        {
          type: 1,
          height:65,
          width: 27,
          openlength: 15,
          offx: 0,
          offdir: Math.PI*4/3,
          open: 14
        },
        {
          type: 0,
          height: 48,
          width: 33,
          offx: 0,
          offdir: Math.PI/3,
          open: -16,
        },
        {
          type: 0,
          height: 48,
          width: 33,
          offx: 0,
          offdir: Math.PI,
          open: -16,
        },
        {
          type: 0,
          height: 48,
          width: 33,
          offx: 0,
          offdir: Math.PI*5/3,
          open: -16,
        },
      ],
      body:{
        shape: 0,
      }
    },
    "Mega Trapper":{
      canons:[
        {
          type: 1,
          height:68,
          width: 33,
          openlength: 20,
          offx: 0,
          offdir: 0,
          open: 30
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Protector":{
      canons:[
        {
          type: 1,
          height:65,
          width: 27,
          openlength: 15,
          offx: 0,
          offdir: 0,
          open: 14
        },
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: Math.PI*2/3,
          open: 23,
        },
        {
          type: 0,
          height: 48,
          width: 28,
          offx: 0,
          offdir: Math.PI*4/3,
          open: 23
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Auto Trapper":{
      canons:[
        {
          type: 1,
          height:65,
          width: 27,
          openlength: 16,
          offx: 0,
          offdir: 0,
          open: 18
        }
      ],
      turrets:[
        {
          type: 0,
          height:38,
          width: 21,
          offx: 0,
          offdir: 0,
          open: 0,
          rad: 18
        }
      ],
      body:{
        shape: 0,
      }
    },
    "Submachine":{
      canons:[
          {
            type: 0,
            height: 65,
            width: 32,
            offx: 0,
            offdir: 0,
            open: 30
          }
        ],
      body:{
        shape: 0,
      }
    },
    ///
    'Gunner':{
      canons:[
        {
          type: 0,
          height:45,
          width: 20,
          offx: 24,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height:45,
          width: 20,
          offx: -24,
          offdir: 0,
          open: 0
        },
        ///
        {
          type: 0,
          height:58,
          width: 19,
          offx: 13,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height:58,
          width: 19,
          offx: -13,
          offdir: 0,
          open: 0
        },
      ],
      body:{
        shape: 0
      }
    },
    'Auto Gunner':{
      canons:[
        {
          type: 0,
          height:45,
          width: 20,
          offx: 24,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height:45,
          width: 20,
          offx: -24,
          offdir: 0,
          open: 0
        },
        ///
        {
          type: 0,
          height:58,
          width: 19,
          offx: 13,
          offdir: 0,
          open: 0
        },
        {
          type: 0,
          height:58,
          width: 19,
          offx: -13,
          offdir: 0,
          open: 0
        },
      ],
      turrets:[
        {
          type: 0,
          height:38,
          width: 21,
          offx: 0,
          offdir: 0,
          open: 0,
          rad: 18
        }
      ],
      body:{
        shape: 0
      }
    },
    testbed:{
      canons:[
        {
          hidden: 1,
          type: 0,
          height: 40,
          width: 1,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    bigView:{
      canons:[
        {
          hidden: 1,
          type: 0,
          height: 40,
          width: 1,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    'pre launch':{
      canons:[
        {
          hidden: 1,
          type: 0,
          height: 36,
          width: 1,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    shapes:{
      canons:[
        {
          hidden: 1,
          type: 0,
          height: 40,
          width: 1,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 0,
      }
    },
    shape1:{
      canons:[
        {
          hidden: 1,
          type: 0,
          height: 50,
          width: 1,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 1,
        width: 1,
        height: 1
      }
    },
    shape2:{
      canons:[
        {
          hidden: 1,
          type: 0,
          height: 50,
          width: 1,
          offx: 0,
          offdir: 0,
          open: 0
        }
      ],
      body:{
        shape: 2,
      }
    },
    ///boss
    Summoner:{
      canons:[
        {
          type: 0,
          height: 44,
          width: 20,
          offx: 0,
          offdir: 0,
          open: 28,
        },
        {
          type: 0,
          height: 44,
          width: 20,
          offx: 0,
          offdir: Math.PI/2,
          open: 28
        },
        {
          type: 0,
          height: 44,
          width: 20,
          offx: 0,
          offdir: Math.PI,
          open: 28
        },
        {
          type: 0,
          height: 44,
          width: 20,
          offx: 0,
          offdir: -Math.PI/2,
          open: 28
        }
      ],
      body:{
        shape: 1,
        width: 1,
        height: 1
      }
    }
  }:
  ///SERVER///
  {
    "Basic":new function(){
      this.screen = 1408;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 32;
        this.offTime = 0;
        this.type    = 0;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 68;
        this.rand= 0.14;
        ///
        this.speed = 0.31;
        this.pene = 1.7;
        this.peneMult = 1;
        this.damage = 4;
        this.size = 18;
        ///
        this.weight = 0.3;
        this.back = 0.4;
      }
    },
    "Flank Guard":new function(){
      this.screen = 1408;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 32;
        this.offTime = 0;
        this.type    = 0;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 65;
        this.rand= 0.14;
        ///
        this.speed = 0.31;
        this.pene = 1.5;
        this.damage = 3.6;
        this.size = 18;
        ///
        this.weight = 0.3;
        this.back = 0.4;
      }
      this.canons[1] = {
        reload :      32,
        offTime :     0,
        ///
        offdir :      Math.PI,
        offx :        0,
        canonLength : 58,
        rand :        0.13,
        ///
        speed :       0.28,
        pene :        .6,
        damage :      2,
        size :        17,
        ///
        weight :      0.5,
        back :        1.2
      };
    },
    "Twin":new function(){
      this.screen = 1408;
      this.canons = [];
      this.canons[1] = new function(){
        this.reload = 28;
        this.offTime = 0;
        ///
        this.offdir = 0;
        this.offx = -18;
        this.canonLength = 60;
        this.rand= 0.21;
        ///
        this.speed = 0.31;
        this.pene = 1.3;
        this.peneMult = 1;
        this.damage = 3.5;
        this.size = 17;
        ///
        this.weight = 0.3;
        this.back = 0.3;
      };
      this.canons[0] = new function(){
        this.reload = 28;
        this.offTime = 0.5;
        ///
        this.offdir = 0;
        this.offx = 18;
        this.canonLength = 60;
        this.rand= 0.21;
        ///
        this.speed = 0.31;
        this.pene = 1.3;
        this.peneMult = 1;
        this.damage = 3.5;
        this.size = 17;
        ///
        this.weight = 0.3;
        this.back = 0.4;
      };
    },
    "Rifle":new function(){
      this.screen = 1408;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 14;
        this.offTime = 0;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 62;
        this.rand= 0.6;
        ///
        this.speed = 0.32;//.22
        this.pene = 1.2;
        this.damage = 2.6;
        this.size = 18;//17
        ///
        this.weight = 0.3;
        this.back = 0.6;
      }
    },
    "Sniper":new function(){
      this.screen = 1664;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 55;
        this.offTime = 0;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 80;
        this.rand= 0.2;
        ///
        this.speed = 0.4;
        this.pene = 2.5;
        this.damage = 2.7;
        this.size = 18;
        ///
        this.weight = .6;
        this.back = 0.3;
      }
    },
    ///
    "Triple": new function(){
      this.screen = 1408;
      this.canons = [];
      let c = new Array(3).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 58,
        rand :        0.2,
        ///
        speed :       0.27,
        pene :        1,
        damage :      2,
        size :        16,
        ///
        weight :      0.5,
        back :        0.4
      }));
      c[0].offx = 6; c[0].offdir = .4;
      c[1].offx = -6;c[1].offdir = -.4;
      c[2].canonLength = 65;c[2].offTime = .5;
      this.canons = c;
    },
    "Twin Flank":new function(){
      this.screen = 1408;
      let c = new Array(4).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        type:         0,
        life:         180,
        ///
        offdir :      0,
        offx :        -18,
        canonLength : 60,
        rand :        0.15,
        ///
        speed :       0.31,
        pene :        1.2,
        damage :      3,
        size :        16,
        ///
        weight :      .3,
        back :        0
      }));
      c[2].offdir = c[3].offdir = Math.PI;
      c[1].offTime = c[3].offTime = .5;
      c[1].offx = c[3].offx = 18;
      this.canons = c;
    },
    "Quad Shot":new function(){
      this.screen = 1408;
      this.canons = [];
      let c = new Array(4).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 66,
        rand :        0.2,
        ///
        speed :       0.27,
        pene :        1.3,
        damage :      3.5,
        size :        15,
        ///
        weight :      0.5,
        back :        0
      }));
      c[1].offdir = Math.PI/2  ;c[1].offTime = .5;
      c[2].offdir = Math.PI;
      c[3].offdir = Math.PI*1.5;c[3].offTime = .5;
      this.canons = c;
    },
    "Destroyer":new function(){
      this.screen = 1408;
      let c = new Array(1).fill(null).map(()=>({
        reload :      105,
        offTime :     0,
        type:         0,
        life:         180,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 62,
        rand :        0.10,
        ///
        speed :       0.22,
        pene :        18,
        damage :      1.5,
        size :        27,
        ///
        exitSpeed:    53,
        weight :      .3,
        back :        3.8
      }));
      ///
      this.canons = c;
    },
    "Assasin":new function(){
      this.screen = 1920;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 52;
        this.offTime = 0;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 85;
        this.rand= 0.1;
        ///
        this.speed = 0.41;
        this.pene = 2.5;
        this.damage = 2.6;
        this.size = 19;
        ///
        this.weight = .6;
        this.back = 0.3;
      }
    },
    "Pilote":new function(){
      this.screen = 1664;
      this.maxDrone = 7;
      this.canons = [];
      let c = new Array(2).fill(null).map(()=>({
        reload :      220,
        offTime :     0,
        type:         1,
        life:         -1,
        auto:         1,
        ///
        offdir :      Math.PI/2,
        offx :        0,
        canonLength : 48,
        rand :        0.2,
        ///
        speed :       0.3,
        pene :        5.3,
        damage :      2,
        size :        14,
        ///
        exitSpeed:    25,
        weight :      0.4,
        back :        0
      }));
      c[1].offdir = -Math.PI/2;
      this.canons = c;
    },
    "Hover Tank":new function(){
      this.screen = 1408;
      let c = new Array(3).fill(null).map(()=>({
        reload :      30,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 58,
        rand :        0.13,
        ///
        speed :       0.28,
        pene :        .6,
        damage :      2,
        size :        16,
        ///
        weight :      0.5,
        back :        1
      }));
      c[0].back = .1; c[0].height = 62; c[0].pene = 1.35; c[0].damage = 3.3;c[0].speed = .31;
      c[1].offdir = -Math.PI-.4; c[1].offx = -5;c[1].offTime = .5;
      c[2].offdir = -Math.PI+.4; c[2].offx =  5;c[2].offTime = .5;
      ///
      this.canons = c;
    },
    "Trapper":new function(){
      this.screen = 1664;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 30;
        this.offTime = 0;
        this.type    = 2;
        this.life    =360;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 68;
        this.rand= 0.3;
        ///
        this.speed = 0.15;
        this.pene = 4.2;
        this.damage = 1.3;
        this.size = 12;
        ///
        this.exitSpeed = 60;
        this.weight = 0.3;
        this.back = 0.4;
      }
    },
    ///
    "Rocket":new function(){
      this.screen = 1408;
      let c = new Array(2).fill(null).map(()=>({
        reload :      20,
        offTime :     0,
        ///
        offdir :      -Math.PI-.4,
        offx :        -5,
        canonLength : 56,
        rand :        0.3,
        ///
        speed :       0.27,
        pene :        1.6,
        damage :      3.5,
        size :        16,
        ///
        weight :      1,
        back :        0.85
      }));
      c[1].offdir = -Math.PI+.4;c[1].offx = 5;
      this.canons = c;
    },
    "Hybrid":new function(){
      this.screen = 1408;
      this.maxDrone = 2;
      let c = new Array(1).fill(null).map(()=>({
        reload :      105,
        offTime :     0,
        type:         0,
        life:         180,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 62,
        rand :        0.10,
        ///
        speed :       0.22,
        pene :        17,
        damage :      1.5,
        size :        27,
        ///
        exitSpeed:    53,
        weight :      .3,
        back :        3.8
      }));
      c.push({
        reload :      200,
        offTime :     0,
        type:         1.1,
        life:         -1,
        auto:         1,
        ///
        offdir :      Math.PI,
        offx :        0,
        canonLength : 48,
        rand :        0.2,
        ///
        speed :       0.3,
        pene :        5,
        damage :      1.8,
        size :        14,
        ///
        exitSpeed:    25,
        weight :      0.4,
        back :        0.1
      })
      ///
      this.canons = c;
    },
    "Annihilator":new function(){
      this.screen = 1408;
      let c = new Array(1).fill(null).map(()=>({
        reload :      105,
        offTime :     0,
        type:         0,
        life:         180,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 62,
        rand :        0.10,
        ///
        speed :       0.215,
        pene :        17,
        damage :      1.5,
        size :        34,
        ///
        exitSpeed:    53,
        weight :      .3,
        back :        4
      }));
      ///
      this.canons = c;
    },
    "Sprayer":new function(){
      this.screen = 1664;
      let c = new Array(5).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 82,
        rand :        0.11,
        ///
        speed :       0.4,
        pene :        .45,
        damage :      2.2,
        size :        15,
        ///
        weight :      0.5,
        back :        0.15
      }));
      let d = 7;
      c[0].canonLength -= d ; c[0].offTime = .2;
      c[1].canonLength -= d*2 ; c[1].offTime = .4;
      c[2].canonLength -= d*3 ; c[2].offTime = .6;
      c[3].canonLength -= d*4 ; c[3].offTime = .8;
      ///
      this.canons = c;
    },
    "Ranger":new function(){
      this.screen = 2208;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 54;
        this.offTime = 0;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 88;
        this.rand= 0.1;
        ///
        this.speed = 0.41;
        this.pene = 3;
        this.damage = 2.5;
        this.size = 19;
        ///
        this.weight = .7;
        this.back = 0.8;
      }
    },
    "Treble": new function(){
      this.screen = 1408;
      this.canons = [];
      let c = new Array(3).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 55,
        rand :        0.16,
        ///
        speed :       0.27,
        pene :        1,
        damage :      2,
        size :        16,
        ///
        weight :      0.5,
        back :        0.4
      }));
      c[0].offx = 17;
      c[1].offx = -17;
      c[2].canonLength = 60;c[2].offTime = .5;
      this.canons = c;
    },
    "Triple Twin":new function(){
      this.screen = 1408;
      let c = new Array(6).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        type:         0,
        life:         180,
        ///
        offdir :      0,
        offx :        -18,
        canonLength : 60,
        rand :        0.15,
        ///
        speed :       0.31,
        pene :        1.2,
        damage :      2.8,
        size :        16,
        ///
        weight :      .3,
        back :        0
      }));
      c[2].offdir = c[3].offdir = Math.PI*2/3;
      c[4].offdir = c[5].offdir = Math.PI*4/3;
      c[1].offTime = c[3].offTime = c[5].offTime = .5;
      c[1].offx = c[3].offx = c[5].offx = 18;
      this.canons = c;
    },
    "Penta Shot": new function(){
      this.screen = 1408;
      this.canons = [];
      let c = new Array(5).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 55,
        rand :        0.16,
        ///
        speed :       0.27,
        pene :        .95,
        damage :      2.3,
        size :        16,
        ///
        weight :      0.5,
        back :        0.28
      }));
      c[0].offx =  7; c[0].offdir =  .6;
      c[1].offx = -7; c[1].offdir = -.6;
      c[2].offx =  3; c[2].offdir =  .3; c[2].canonLength = 63; c[2].offTime = .5;
      c[3].offx = -3; c[3].offdir = -.3; c[3].canonLength = 63; c[3].offTime = .5;
      c[4].canonLength = 69;
      this.canons = c;
    },
    "Octo Shot":new function(){
      this.screen = 1408;
      this.canons = [];
      let c = new Array(8).fill(null).map(()=>({
        reload :      28,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 62,
        rand :        0.2,
        ///
        speed :       0.27,
        pene :        1.3,
        damage :      2.5,
        size :        16,
        ///
        weight :      0.5,
        back :        0
      }));
      c[1].offdir = Math.PI*1/4;c[1].offTime = .5;
      c[2].offdir = Math.PI*2/4;
      c[3].offdir = Math.PI*3/4;c[3].offTime = .5;
      c[4].offdir = Math.PI;
      c[5].offdir = Math.PI*5/4;c[5].offTime = .5;
      c[6].offdir = Math.PI*6/4;
      c[7].offdir = Math.PI*7/4;c[7].offTime = .5;
      this.canons = c;
    },
    "Cyclone":new function(){
      this.screen = 1408;
      this.canons = new Array(10).fill(null).map(()=>({
        reload :      33,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 52,
        rand :        0.13,
        ///
        speed :       0.265,
        pene :        1,
        damage :      3.7,
        size :        12,
        ///
        weight :      0.5,
        back :        0
      }));
      this.canons[1].offdir = Math.PI*.2 ;this.canons[1].offTime = .5;
      this.canons[2].offdir = Math.PI*.4 ;this.canons[2].offTime = 0;
      this.canons[3].offdir = Math.PI*.6 ;this.canons[3].offTime = .5;
      this.canons[4].offdir = Math.PI*.8 ;this.canons[4].offTime = 0;
      this.canons[5].offdir = Math.PI*1  ;this.canons[5].offTime = .5;
      this.canons[6].offdir = Math.PI*1.2;this.canons[6].offTime = 0;
      this.canons[7].offdir = Math.PI*1.4;this.canons[7].offTime = .5;
      this.canons[8].offdir = Math.PI*1.6;this.canons[8].offTime = 0;
      this.canons[9].offdir = Math.PI*1.8;this.canons[9].offTime = .5;
    },
    "Booster":new function(){
      this.screen = 1408;
      let c = new Array(5).fill(null).map(()=>({
        reload :      31,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 52,
        rand :        0.13,
        ///
        speed :       0.28,
        pene :        .6,
        damage :      2,
        size :        16,
        ///
        weight :      0.5,
        back :        0.86
      }));
      c[0].back = .2; c[0].height = 62; c[0].pene = 1.35; c[0].damage = 3.3;c[0].speed = .32;
      c[1].offdir = -Math.PI-.65; c[1].offx = -6;
      c[2].offdir = -Math.PI+.65; c[2].offx =  6;
      c[3].offdir = -Math.PI-.35; c[3].offx = -5;c[3].height = 58;c[3].offTime = .5;
      c[4].offdir = -Math.PI+.35; c[4].offx =  5;c[4].height = 58;c[4].offTime = .5;
      ///
      this.canons = c;
    },
    "Raptor":new function(){
      this.screen = 1408;
      let c = new Array(5).fill(null).map(()=>({
        reload :      27,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 57,
        rand :        0.13,
        ///
        speed :       0.29,
        pene :        .5,
        damage :      1.2,
        size :        16,
        ///
        weight :      0.5,
        back :        0.1
      }));
      c[0].back = .1; c[0].height = 65; c[0].pene = 1.30; c[0].damage = 3.3;c[0].speed = .31;
      c[1].offdir = -Math.PI/2 ; c[1].offx = +1;c[1].pene = 1.4; c[1].damage = 3.2;c[1].speed = .30;
      c[2].offdir =  Math.PI/2 ; c[2].offx = -1;c[2].pene = 1.4; c[2].damage = 3.2;c[2].speed = .30;
      c[3].offdir = -Math.PI-.4; c[1].offx = -5;c[3].offTime = .5;c[3].height = 59;
      c[4].offdir = -Math.PI+.4; c[2].offx =  5;c[4].offTime = .5;c[4].height = 59;
      c[3].back = c[4].back = 1.4;
      ///
      this.canons = c;
    },
    "Auto Hover":new function(){
      this.screen = 1408;
      this.DETEC = {
        type: ['Player','Objects'],
        size: 800,
        all: 0,
        maxDis: 850,
      };
      let c = [{
        reload :      35,
        offTime :     0,
        type:         0,
        life:         120,
        auto:         1,
        autoShoot:    1,
        autoDir:      1,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 38,
        rand :        0.1,
        ///
        speed :       0.36,
        pene :        1.8,
        damage :      2.5,
        size :        14,
        ///
        weight :      0.3,
        back :        0.1
      }];
      c = c.concat(new Array(3).fill(null).map(()=>({
        reload :      30,
        offTime :     0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 58,
        rand :        0.13,
        ///
        speed :       0.28,
        pene :        .6,
        damage :      2,
        size :        16,
        ///
        weight :      0.5,
        back :        1
      })));
      c[1].back = .1; c[0].height = 62; c[0].pene = 1.35; c[0].damage = 3.3;
      c[2].offdir = -Math.PI-.4; c[2].offx = -5;c[2].offTime = .5;
      c[3].offdir = -Math.PI+.4; c[3].offx =  5;c[3].offTime = .5;
      ///
      this.canons = c;
    },
    "Autocrat":new function(){
      this.screen = 1664;
      this.maxDrone = 8;
      this.canons = [];
      let c = new Array(4).fill(null).map(()=>({
        reload :      340,
        offTime :     0,
        type:         1,
        life:         -1,
        auto:         1,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 48,
        rand :        0.2,
        ///
        speed :       0.3,
        pene :        4.5,
        damage :      1.8,
        size :        14,
        ///
        exitSpeed:    25,
        weight :      0.5,
        back :        0.1
      }));
      c[1].offdir = Math.PI/2;
      c[2].offdir = Math.PI;
      c[3].offdir = Math.PI*3/2;
      this.canons = c;
    },
    "Predator":new function(){
      this.screen = 1824;
      this.maxDrone = 8;
      this.alpha = .006;
      this.canons = [];
      let c = [{
        reload :      140,
        offTime :     0,
        type:         1,
        life:         -1,
        auto:         0,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 48,
        rand :        0.2,
        ///
        speed :       0.3,
        pene :        5,
        damage :      2,
        size :        14,
        ///
        exitSpeed:    25,
        weight :      0.5,
        back :        0.1
      }]
      this.canons = c;
    },
    "Necromancer":new function(){
      this.screen = 1664;
      this.maxDrone = 22;
      this.necro = {
        type:         3,
        necro:        1,
        ///
        speed :       0.3,
        pene :        4,
        damage :      1.3,
        weight :      0.55
      };
      this.canons = [];
    },
    "BattleShip":new function(){
      this.screen = 1664;
      //this.maxDrone = 7;
      this.canons = [];
      let c = new Array(4).fill(null).map(()=>({
        reload :      27,
        offTime :     0,
        type:         1.2,
        life:         110,
        auto:         0,
        ///
        offdir :      Math.PI/2,
        offx :        12,
        canonLength : 48,
        rand :        0.2,
        ///
        speed :       0.52,
        pene :        .8,
        damage :      .9,
        size :        6,
        ///
        exitSpeed:    25,
        weight :      0.05,
        back :        0
      }));
      c[1].offdir = -Math.PI/2;c[1].offx = -12;c[1].offTime = .5;
      c[2].offdir =  Math.PI/2;c[2].offx = -12;c[2].offTime = .5;
      c[3].offdir = -Math.PI/2;c[3].offx =  12;
      c[2].type = c[3].type = 1.3;
      c[2].life = c[3].life = 145;
      this.canons = c;
    },
    "Fortress":new function(){
      this.screen = 1664;
      //this.maxDrone = 7;
      this.canons = [];
      let c = new Array(3).fill(null).map(()=>({
        reload :      50,
        offTime :     0,
        type:         2,
        life:         360,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 65,
        rand :        0.2,
        ///
        speed :       0.15,
        pene :        4,
        damage :      0.8,
        size :        10,
        ///
        exitSpeed:    60,
        weight :      0.3,
        back :        0
      }));
      c[1].offdir = Math.PI*2/3;c[2].offdir =  Math.PI*4/3;
      c = c.concat(new Array(3).fill(null).map(()=>({
        reload :      40,
        offTime :     .5,
        type:         1.2,
        life:         100,
        auto:         0,
        ///
        offdir :      Math.PI/3,
        offx :        0,
        canonLength : 48,
        rand :        0.2,
        ///
        speed :       0.42,
        pene :        .7,
        damage :      .8,
        size :        6,
        ///
        exitSpeed:    28,
        weight :      0.05,
        back :        0
      })));
      c[4].offdir = Math.PI*2/3+Math.PI/3;c[5].offdir =  Math.PI*4/3+Math.PI/3;
      this.canons = c;
    },
    "Mega Trapper":new function(){
      this.screen = 1664;
      //this.maxDrone = 7;
      this.canons = [];
      let c = [{
        reload :      85,
        offTime :     0,
        type:         2,
        life:         480,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 68,
        rand :        0.2,
        ///
        speed :       0.15,
        pene :        18,
        damage :      1.4,
        size :        19,
        ///
        exitSpeed:    70,
        weight :      0.3,
        back :        1.2
      }];
      this.canons = c;
    },
    "Protector":new function(){
      this.screen = 1664;
      this.maxDrone = 4;
      let c = [{
        reload :      48,
        offTime :     0,
        type:         2,
        life:         360,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 65,
        rand :        0.2,
        ///
        speed :       0.16,
        pene :        5,
        damage :      1.2,
        size :        10,
        ///
        exitSpeed:    60,
        weight :      0.3,
        back :        .8
      }];
      c = c.concat(new Array(2).fill(null).map(()=>({
        reload :      250,
        offTime :     0,
        type:         1,
        life:         -1,
        auto:         1,
        ///
        offdir :      Math.PI*2/3,
        offx :        0,
        canonLength : 48,
        rand :        0.2,
        ///
        speed :       0.3,
        pene :        5.5,
        damage :      1.5,
        size :        14,
        ///
        exitSpeed:    25,
        weight :      0.5,
        back :        0.1
      })));
      c[2].offdir = Math.PI*4/3;c[2].offTime = .5;
      this.canons = c;
    },
    "Auto Trapper":new function(){
      this.screen = 1664;
      this.DETEC = {
        type: ['Player','Objects'],
        size: 1500,
        all: 0,
        maxDis: 800,
      };
      let c = [{
        reload :      35,
        offTime :     0,
        type:         0,
        life:         120,
        auto:         1,
        autoShoot:    1,
        autoDir:      1,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 38,
        rand :        0.1,
        ///
        speed :       0.32,
        pene :        1.5,
        damage :      2.6,
        size :        14,
        ///
        weight :      0.3,
        back :        0.1
      }];
      c.push({
        reload :      36,
        offTime :     0,
        type:         2,
        life:         360,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 65,
        rand :        0.2,
        ///
        speed :       0.16,
        pene :        4,
        damage :      1.4,
        size :        10,
        ///
        exitSpeed:    60,
        weight :      0.3,
        back :        .8
      });
      this.canons = c;
    },
    "Submachine":new function(){
      this.screen = 1408;
      this.canons = [];
      this.canons[0] = new function(){
        this.reload = 20;
        this.offTime = 0;
        ///
        this.offdir = 0;
        this.offx = 0;
        this.canonLength = 60;
        this.rand= 0.62;
        ///
        this.speed = 0.27;//.22
        this.pene = 3;
        this.damage = 1.6;
        this.size = 23;//17
        ///
        this.weight = 0.3;
        this.back = 0.8;
      }
    },
    ///dev
    'Gunner':new function(){
      this.screen = 1408;
      c = [];
      c = c.concat(new Array(4).fill(null).map(()=>({
        reload :      33,
        offTime :     0,
        ///
        offdir :      0,
        offx :        24,
        canonLength : 45,
        rand :        0.1,
        ///
        speed :       0.35,
        pene :        .42,
        damage :      2.2,
        size :        12,
        ///
        weight :      0.5,
        back :        0
      })));
      c[1].offx *= -1;
      c[2].canonLength = c[3].canonLength = 58;
      c[2].offx = 13;c[3].offx = -13;
      c[1].offTime = c[2].offTime = .5;
      this.canons = c;
    },
    'Auto Gunner':new function(){
      this.screen = 1408;
      this.DETEC = {
        type: ['Player','Objects'],
        size: 700,
        all: 0,
        maxDis: 800,
      };
      let c = [{
        reload :      35,
        offTime :     0,
        type:         0,
        life:         120,
        auto:         1,
        autoShoot:    1,
        autoDir:      1,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 38,
        rand :        0.1,
        ///
        speed :       0.32,
        pene :        1.8,
        damage :      2,
        size :        14,
        ///
        weight :      0.3,
        back :        0.1
      }];
      c = c.concat(new Array(4).fill(null).map(()=>({
        reload :      33,
        offTime :     0,
        ///
        offdir :      0,
        offx :        24,
        canonLength : 45,
        rand :        0.1,
        ///
        speed :       0.41,
        pene :        .31,
        damage :      2.2,
        size :        12,
        ///
        weight :      0.5,
        back :        0
      })));
      c[2].offx *= -1;
      c[3].canonLength = c[4].canonLength = 58;
      c[3].offx = 13;c[4].offx = -13;
      c[2].offTime = c[3].offTime = .5;
      this.canons = c;
    },
    testbed:new function(){
      this.screen = 1408;
      this.canons = [];
    },
    'pre launch':new function(){
      this.screen = 1408;
      this.canons = [];
    },
    bigView:new function(){
      this.screen = 2600;
      this.canons = [];
    },
    shapes:new function(){
      this.screen = 1408;
      this.canons = [];
    },
    shape1:new function(){
      this.screen = 1408;
      this.canons = [];
    },
    shape2:new function(){
      this.screen = 1408;
      this.canons = [];
    },
    ///Boss
    "Summoner":new function(){
      this.screen = 2400;
      this.canons = [];
      this.boss = true;
      this.maxDrone = 35;
      let c = new Array(4).fill(null).map(()=>({
        reload :      8,
        offTime :     0,
        auto:         1,
        type:         3.1,
        life:         130,
        ///
        offdir :      0,
        offx :        0,
        canonLength : 50,
        rand :        0.5,
        ///
        speed :       0.39,
        pene :        5.5,
        damage :      4.5,
        size :        20,
        ///
        exitSpeed:    35,
        weight :      0.2,
        back :        0
      }));
      c[1].offdir = Math.PI/2  ;c[1].offTime = .5;
      c[2].offdir = Math.PI;
      c[3].offdir = Math.PI*1.5;c[3].offTime = .5;
      this.canons = c;
    },
  };
  ///
  exports.defaultUps = [
    'Health Regen',
    'Reload',
    'Max Health',
    'Bullet Speed',
    'Movement Speed',
    'Bullet Damage',
    'Body Damage',
    'Bullet Penetration'
  ];
  exports.tree = [
    {
      Basic:['Twin','Rifle','Sniper','Flank Guard'],
      testbed:['bigView','shapes','pre launch'],
      shapes:['shape1','shape2'],
      'pre launch':['Fortress','Necromancer','Auto Hover']
    },
    {
      Twin:['Twin Flank','Triple','Quad Shot'],
      Rifle:['Destroyer','Gunner'],
      Sniper:['Trapper','Assasin','Pilote'],
      'Flank Guard':['Triple','Hover Tank'],
    },
    {
      'Flank Guard': ['Rocket'],
      Rifle:         ['Submachine'],
      Gunner:        ['Sprayer','Auto Gunner'],
      Destroyer:     ['Hybrid','Annihilator'],
      Pilote:        ['Predator','Necromancer','BattleShip','Autocrat'],
      'Hover Tank':  ['Raptor','Booster'],
      'Quad Shot':   ['Cyclone','Octo Shot'],
      'Twin Flank':  ['BattleShip','Triple Twin'],
      Triple:        ['Treble','Penta Shot'],
      Assasin:       ['Sprayer','Ranger'],
      Trapper:       ['Protector','Auto Trapper','Mega Trapper']
    }
  ];
  exports.list = [
    "Basic",
    ///
    "Twin",
    "Rifle",
    "Sniper",
    "Flank Guard",
    ///
    "Triple",
    "Quad Shot",
    "Destroyer",
    "Assasin",
    "Pilote",
    "Hover Tank",
    "Trapper",
    "Gunner",
    "Twin Flank",
    ///
    "Rocket",
    "Hybrid",
    "Annihilator",
    "Sprayer",
    "Ranger",
    'Triple Twin',
    "Treble",
    "Penta Shot",
    "Octo Shot",
    "Cyclone",
    "Booster",
    "Raptor",
    "Auto Hover",
    "Autocrat",
    "Predator",
    "BattleShip",
    "Fortress",
    "Mega Trapper",
    "Protector",
    "Auto Trapper",
    "Submachine",
    "Auto Gunner",
    ///
    'Necromancer',
    'pre launch',
    'testbed',
    'bigView',
    'shapes',
    'shape1',
    'shape2',
    ///
    'Summoner'
  ];

})(typeof(exports) === 'undefined' ? function(){this['TanksConfig'] = {}; return this['TanksConfig']}() : exports,
   typeof(exports) === 'undefined' ? 'client' : 'server')
