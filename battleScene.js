const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

////draggle enemy
const draggle = new Monster(monsters.Draggle);

/// emby pokemon
const emby = new Monster(monsters.Emby);

const renderedSprites = [draggle, emby];

emby.attacks.forEach((attack) => {
  ///button creatuin
  const button = document.createElement("button");
  button.innerHTML = attack.name;
  document.querySelector("#attacksBox").append(button);
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animateBattle();
//animate()

///Que for Drraggle attack
const queue = [];

/// our event listener for our buttons (attack)
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectAttack = attack[e.currentTarget.innerHTML];
    emby.attack({
      attack: selectAttack,
      recipient: draggle,
      renderedSprites,
    });

    if (draggle.health <= 0) {
      queue.push(() => {
        draggle.faint()
        })
        queue.push(() => {
            //fade back to black
            gsap.to('#overlappingDiv', {
                opacity: 1,
                onComplete: () => {
                    cancelAnimationFrame(battleAnimationID)
                }
            })
        })
    }
    ///setting random attack for draggle or enemy
    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: draggle,
        renderedSprites,
      });

      if (draggle.health <= 0) {
        queue.push(() => {
          emby.faint()
          })
          return
      }
    });
  });
  button.addEventListener("mouseenter", (e) => {
    const selectAttack = attack[e.currentTarget.innerHTML];
    document.querySelector("#attackType").innerHTML = selectAttack.type;
    document.querySelector("#attackType").style.color = selectAttack.color;
  });
});

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
