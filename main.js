title = "RAINCATCHER";

description = `
[Tap] Turn
`;

characters = [
  `
 l
lll
l l
`,
  `
 lllll
ll   l
llllll
llllll
 lllll
 ll ll
  `,
  `
 lllll
ll   l
llllll
llllll
 ll ll
  `,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 15,
};

/**
 * @type {{
 * from: Vector, to: Vector, vel: Vector,
 * ticks: number, prevLine: any, isActive: boolean
 * }[]}
 */
let lines;
let activeTicks;
/** @type {{pos: Vector, vel: Vector}[]} */
let stars;
/** @type {{x: number, vx: number}} */
let player;
let multiplier;
/** @type {Vector[]} */
let rain;

function update() {
  if (!ticks) {
    rain = [vec(50, 5)];
    lines = [];
    activeTicks = -1;
    stars = [];
    player = { x: 40, vx: 1 };
    multiplier = 1;
  }
  color("light_blue");
    rain.forEach((p) => {
      box(p, 3);
    });
  if (lines.length === 0) {
    const from = vec(rnd(30, 70), 0);
    lines.push({
      from,
      to: vec(from),
      vel: vec(0.5 * difficulty, 0).rotate(PI / 2),
      ticks: ceil(30 / difficulty),
      prevLine: undefined,
      isActive: false,
    });
  }
  color("light_red");
  rect(0, 90, 100, 10);
  activeTicks--;
  remove(lines, (l) => {
    if (l.isActive) {
      color("yellow");
      line(l.from, l.to, 4);
      return activeTicks < 0;
    }
    l.ticks--;
    if (activeTicks > 0) {
      if (l.ticks > 0) {
        stars.push({ pos: vec(l.to), vel: vec(0, -l.to.y * 0.02) });
      }
      return true;
    }
    if (l.ticks > 0) {
      l.to.add(l.vel);
      if (activeTicks < 0 && (l.to.y > 90 || lines.length > 160)) {
        play("explosion");
        let al = l;
        color("yellow");
        for (let i = 0; i < 99; i++) {
          particle(al.to, 30, 2);
          al.isActive = true;
          al = al.prevLine;
          if (al == null) {
            break;
          }
        }
        activeTicks = ceil(20 / sqrt(difficulty));
        multiplier = 1;
      }
    } else if (l.ticks === 0) {
      play("hit");
      color("black");
      particle(l.to, 9, 1);
      for (let i = 0; i < rndi(1, 4); i++) {
        lines.push({
          from: vec(l.to),
          to: vec(l.to),
          vel: vec(l.vel)
            .normalize()
            .rotate(rnds(0.7))
            .mul(rnd(0.3, 1) * sqrt(difficulty)),
          ticks: ceil(rnd(20, 40) / difficulty),
          prevLine: l,
          isActive: false,
        });
      }
    }
    color("light_black");
    line(l.from, l.to, 2);
  });
  if (
    input.isJustPressed ||
    (player.x < 0 && player.vx < 0) ||
    (player.x > 99 && player.vx > 0)
  ) {
    play("laser");
    player.vx *= -1;
  }
  player.x += player.vx * sqrt(difficulty);
  color("black");
  if (
    char(addWithCharCode("b", floor(ticks / 10) % 2), player.x, 87, {
      mirror: { x: player.vx > 0 ? 1 : -1 },
    }).isColliding.rect.yellow
  ) {
    play("lucky");
    end();
  }
 
};


addEventListener("load", onLoad);