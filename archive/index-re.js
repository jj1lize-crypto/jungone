const BASE = "../assets/jungone-main/";
const MEDIA_BASE = "../assets/media/";

// ===== Image system (4-color mapping: bl/gn/pk/yw) =====
// space → bl (blue), body → gn (green), taste → pk (pink), safety → yw (yellow)
const TOPIC_COLOR = { space: "bl", body: "gn", taste: "pk", safety: "yw" };

// Topic cover cards (S2 — choose topic)
const TSRCS = {
  space:  BASE + "oncardbl-topic.png?v=png-mobile-2",
  body:   BASE + "oncardgn-topic.png?v=png-mobile-2",
  taste:  BASE + "oncardpk-topic.png?v=png-mobile-2",
  safety: BASE + "oncardyw-topic.png?v=png-mobile-2"
};

// Question cards front (S3 — choose question)
// Each color has 9 question cards: oncard{color}1.png?v=png-mobile-2 ~ oncard{color}9.png?v=png-mobile-2
const ONCARDS_Q = {
  bl: Array.from({length:9}, (_,i)=> BASE + "oncardbl" + (i+1) + ".png?v=png-mobile-2"),
  gn: Array.from({length:9}, (_,i)=> BASE + "oncardgn" + (i+1) + ".png?v=png-mobile-2"),
  pk: Array.from({length:9}, (_,i)=> BASE + "oncardpk" + (i+1) + ".png?v=png-mobile-2"),
  yw: Array.from({length:9}, (_,i)=> BASE + "oncardyw" + (i+1) + ".png?v=png-mobile-2")
};
function qcardSrc(topic, qIdx){  // qIdx 0-based
  const c = TOPIC_COLOR[topic];
  return c ? ONCARDS_Q[c][qIdx] : "";
}

// Card back (used when card is "selected" — appears as the conv-card background)
const OFFCARDS_BACK = {
  space:  BASE + "offcardbl-back-empty.png?v=png-mobile-2",
  body:   BASE + "offcardgn-back-empty.png?v=png-mobile-2",
  taste:  BASE + "offcardpk-back-empty.png?v=png-mobile-2",
  safety: BASE + "offcardyw-back-empty.png?v=png-mobile-2"
};

// ===== Face-to-Face physical cards (actual files scanned from repo) =====
const OFFCARD_FILES = {
  gn: ["gn1-3","gn1-4","gn1-6","gn2-6","gn3-1","gn3-9","gn3-10"],
  pk: ["pk2-9","pk2-10","pk3-4","pk3-8"],
  bl: ["bl1-5","bl1-7","bl1-9","bl3-2","bl3-5","bl3-7"],
  yw: ["yw1-10","yw2-2","yw2-3","yw2-4","yw2-5","yw3-3","yw3-6"]
};
function offCardImg(code){ return BASE + "offcard" + code + ".png?v=png-mobile-2"; }
function offPlantImg(code){ return BASE + "offplant" + code + ".png?v=png-mobile-2"; }
// Map physical-card category color → topic key (for garden color + category label reuse)
const OFFCAT_TOPIC = { bl:"space", gn:"body", pk:"taste", yw:"safety" };


// Topic card fronts (S2 — used as the body of each topic tile + 3 random plants on top)
const ONCARDS_FRONT = {
  space:  BASE + "oncardbl-front.png?v=png-mobile-2",
  body:   BASE + "oncardgn-front.png?v=png-mobile-2",
  taste:  BASE + "oncardpk-front.png?v=png-mobile-2",
  safety: BASE + "oncardyw-front.png?v=png-mobile-2"
};

// Helper: pick 3 random plants from oncard{color}1~6 for a topic tile
function randomPlantsForTopic(topic){
  const c = TOPIC_COLOR[topic];
  if(!c) return [];
  const all = [1,2,3,4,5,6];
  // Shuffle and take 3
  for(let i = all.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0,3).map(n => BASE + "oncard" + c + n + ".png?v=png-mobile-2");
}

// Listening cards (S6 — 6 listening style cards)
const LISTEN_KEYS = ["a01","a02","a03","a04","a05","a06"];
const ASRCS = {
  a01: BASE + "listencard1.png?v=png-mobile-2",
  a02: BASE + "listencard2.png?v=png-mobile-2",
  a03: BASE + "listencard3.png?v=png-mobile-2",
  a04: BASE + "listencard4.png?v=png-mobile-2",
  a05: BASE + "listencard5.png?v=png-mobile-2",
  a06: BASE + "listencard6.png?v=png-mobile-2"
};

// Garden plants (S9 — when an entry is planted)
// onplant{color}{1-9}.png?v=png-mobile-2, mapped from the question chosen
const ONPLANTS = {
  bl: Array.from({length:9}, (_,i)=> BASE + "onplantbl" + (i+1) + ".png?v=png-mobile-2"),
  gn: Array.from({length:9}, (_,i)=> BASE + "onplantgn" + (i+1) + ".png?v=png-mobile-2"),
  pk: Array.from({length:9}, (_,i)=> BASE + "onplantpk" + (i+1) + ".png?v=png-mobile-2"),
  yw: Array.from({length:9}, (_,i)=> BASE + "onplantyw" + (i+1) + ".png?v=png-mobile-2")
};
function plantUrlForEntry(e){
  if(!e) return "";
  // Face-to-face: use the offplant matching the physical card code
  if(e.source === "faceToFace" && e.f2fCard){
    return offPlantImg(e.f2fCard);   // offplant{code}.png?v=png-mobile-2 e.g. offplantgn3-10.png?v=png-mobile-2
  }
  // Afar (existing): derive from q ("space-3")
  if(!e.q) return "";
  const parts = e.q.split("-");
  if(parts.length !== 2) return "";
  const topic = parts[0];
  const num = parseInt(parts[1]) - 1;
  const color = TOPIC_COLOR[topic];
  if(!color || isNaN(num) || num < 0 || num >= 9) return "";
  return ONPLANTS[color][num];
}

// Legacy QSRCS retained as a 12-len alias so any leftover qimgIdx % QSRCS.length math still works.
// (Not actually used to fetch images anymore — replaced by qcardSrc + plantUrlForEntry.)
const QSRCS = ONCARDS_Q.bl;

const TCOLORS = {
  space:  '#5c6b3a',
  body:   '#c4845a',
  taste:  '#9aab9e',
  safety: '#6a5e7a'
};

const TNAMES_BY_LANG = {
  ko: {
  space:  "공간 & 일상",
  body:   "몸",
  taste:  "취향 & 감정",
  safety: "관계 & 마음"
},
  en: {
  space:  "Space & Daily Life",
  body:   "Body",
  taste:  "Taste & Feeling",
  safety: "Relationships & Inner Life"
}
};
const ANAMES_BY_LANG = {
  ko: {
  a01: "들어만 줘",
  a02: "질문은 하나만",
  a03: "짧게 공유해줘",
  a04: "조언은 잠시",
  a05: "판단은 멈춰",
  a06: "오늘은 여기까지"
},
  en: {
  a01: "Just listen",
  a02: "One question",
  a03: "Share briefly",
  a04: "Hold the advice",
  a05: "Hold the judgment",
  a06: "Stop for today"
}
};
const ADESC_BY_LANG = {
  ko: {
  a01: "지금은 해결책이 필요하지 않아요. 그냥 들어주세요.",
  a02: "걱정은 고맙지만, 질문이 많으면 부담이 될 수 있어요.",
  a03: "비슷한 경험을 하셨다면, 조언은 빼고 간략하게 공유만 해 주세요.",
  a04: "지금은 조언보다 들어주는 것이 필요해요. 도움이 필요하면 제가 물어볼게요.",
  a05: "비교하거나 바로잡기보다, 먼저 있는 그대로 들어주세요.",
  a06: "오늘은 여기까지만 나누고 싶어요. 나중에 준비되면 다시 이야기할게요."
},
  en: {
  a01: "I don't need a solution right now. Just listen.",
  a02: "I appreciate your care, but too many questions starts to feel heavy.",
  a03: "If you've felt something similar, please share it briefly — no advice needed.",
  a04: "Right now I need listening, not advice. I'll ask if I need help.",
  a05: "Before comparing or correcting, just hear it as it is.",
  a06: "I'd like to stop here for today. We can come back to it when I'm ready."
}
};
const QDATA_BY_LANG = {
  ko: {
  space: [
    {q:"요즘 제일 편하게 머무는 자리는 어디인가요?", f:"그 자리에 있을 때 몸은 어떤 자세가 되나요? (예: 누워있기, 기대앉기, 꼿꼿이 앉기)"},
    {q:"요즘 더 눈에 들어오거나 신경 쓰이는 것이 있나요?", f:"공간, 물건, 사람, 고민 중 어디에 가까운가요?"},
    {q:"최근 집에서 전보다 덜 쓰게 된 공간이나 물건이 있나요?", f:"마지막으로 손이 갔던 때가 기억나나요?"},
    {q:"익숙해서 그냥 두고 있지만, 사실은 조금 불편한 것이 있나요?", f:"언제 그 불편함이 더 느껴지나요?"},
    {q:"최근 새삼 좋다고 느낀 자리나 물건이 있나요?", f:"그게 왜 좋게 느껴졌나요?"},
    {q:"요즘 일상에서 \"예전보다 조금 힘드네\" 싶었던 순간이 있나요?", f:"몸 때문인가요, 마음 때문인가요, 상황 때문인가요?"},
    {q:"최근에 피식 웃음이 났던 일이 있나요?", f:"같이 웃고 싶은 장면이었나요?"},
    {q:"요즘 근황을 한 단어나 한 문장으로 말하면 무엇인가요?", f:"그 말에 가까운 이유가 있나요?"},
    {q:"요즘 하루 중 가장 좋아하는 순간은 언제인가요?", f:"그 순간이 가장 좋은 이유는 무엇인가요?"}
  ],
  body: [
    {q:"요즘 몸에서 사소하게 달라진 게 있나요?", f:"사소한 변화라도 알려주실 수 있나요?"},
    {q:"최근 건강과 관련해 새로 신경 쓰이기 시작한 일이 있나요?", f:"주변 사람들의 건강 이야기를 들을 때 어떤 생각이 스치나요?"},
    {q:"하루 중 몸이 가장 편한 시간대는 언제인가요?", f:"그때 몸의 느낌은 어떤가요?"},
    {q:"요즘 새로 챙기게 된 약이나 건강 루틴이 있나요?", f:"언제, 어떻게 챙기고 있나요?"},
    {q:"요즘 식욕이나 입맛은 어떤가요?", f:"평소와 달라진 점이 있나요?"},
    {q:"요즘 속이 편하거나 불편한 때가 자주 있나요?", f:"어떤 음식이나 시간대와 관련이 있나요?"},
    {q:"요즘 잠은 어떻게 자고 있나요?", f:"아침에 일어났을 때 몸은 어떤가요?"},
    {q:"요즘 몸의 움직임이나 감각에서 달라진 점이 있나요?", f:"손, 무릎, 허리, 눈, 귀 중 신경 쓰이는 곳이 있나요?"},
    {q:"새로 시작했거나 더 챙기게 된 생활 습관이 있나요?", f:"그걸 하고 나면 몸이나 마음이 조금 달라지나요?"}
  ],
  taste: [
    {q:"요즘 자주 찾는 음식, 음료, 노래, 영상, 글이 있나요?", f:"혼자 즐기나요, 누군가와 나누고 싶나요?"},
    {q:"요즘 사소한 행복을 주는 습관이나 취미가 있나요?", f:"조금 더 자주 하고 싶은가요?"},
    {q:"요즘 자주 반복하는 나만의 루틴이 있나요?", f:"하고 나면 상태가 어떻게 달라지나요?"},
    {q:"남들은 잘 몰라도 내가 은근히 고집하는 방식이 있나요?", f:"가족이 그 방식을 알아주면 좋겠나요?"},
    {q:"최근 시간 가는 줄 모르고 몰입해서 하는 일이 있나요?", f:"그 일을 할 때 어떤 에너지를 얻나요?"},
    {q:"요즘 하루 중 가장 기다려지는 시간은 언제인가요?", f:"그 시간이 오기 전 마음은 어떤가요?"},
    {q:"최근 일상 속에서 새롭게 발견한 것이 있나요?", f:"누군가에게 말해주고 싶었나요?"},
    {q:"내가 은근히 꾸준히 하고 있는 작은 행동이 있나요?", f:"계속하게 되는 이유가 있나요?"},
    {q:"요즘 \"아, 좀 살 것 같다\" 싶은 순간은 언제인가요?", f:"그 순간을 조금 더 자주 만들 수 있을까요?"}
  ],
  safety: [
    {q:"마음에 걸리지만 말하지 않고 넘긴 일이 있나요?", f:"말하지 않은 이유가 걱정, 미안함, 타이밍 중 어디에 가까웠나요?"},
    {q:"최근 가족에게 연락할까 말까 망설였던 순간이 있나요?", f:"그때 전하고 싶었던 건 무엇이었나요?"},
    {q:"지금 가족 중 한 사람에게 물어보고 싶은 것이 있나요?", f:"아직 묻지 못한 이유가 있나요?"},
    {q:"가족에게 조심스럽게 부탁하고 싶은 것이 있나요?", f:"어떤 방식으로 말하면 덜 부담스러울까요?"},
    {q:"최근 가족에게 고마웠던 말이나 행동이 있나요?", f:"그때 바로 표현했나요, 아니면 마음에만 두었나요?"},
    {q:"요즘 문득 떠오르는 걱정이 있나요?", f:"혼자 두고 싶은 걱정인가요, 나누고 싶은 걱정인가요?"},
    {q:"최근 챙김이 간섭처럼 느껴진 적이 있나요?", f:"어떤 말투나 질문이 그렇게 느껴졌나요?"},
    {q:"요즘 마음의 여유는 어느 정도인가요?", f:"0에서 10 사이로 말하면 어디쯤인가요?"},
    {q:"지금 가족에게 살짝 꺼내보고 싶은 속마음이 있나요?", f:"언제쯤 말하면 가장 편할 것 같나요?"}
  ]
},
  en: {
  space: [
    {q:"Where do you most enjoy settling down these days?", f:"When you're there, how does your body usually sit? (e.g., lying down, leaning back, sitting upright)"},
    {q:"Is there something catching your eye or staying on your mind lately?", f:"Is it more of a space, an object, a person, or a worry?"},
    {q:"Is there a space or object at home you've been using less than before?", f:"Do you remember the last time you reached for it?"},
    {q:"Is there something you've gotten used to and left as it is, but that actually bothers you a little?", f:"When does the discomfort feel sharpest?"},
    {q:"Have you noticed a spot or object lately that feels newly good to be around?", f:"Why does it feel good to you?"},
    {q:"Has there been a moment recently that felt \"a bit harder than it used to\"?", f:"Was it your body, your mind, or the situation?"},
    {q:"Has anything made you quietly smile recently?", f:"Was it a moment you'd want to share?"},
    {q:"How would you sum up how you've been, in one word or one sentence?", f:"What's behind that word?"},
    {q:"What's your favorite moment of the day lately?", f:"What makes that moment the best one?"}
  ],
  body: [
    {q:"Is there a small change in your body lately?", f:"Even something small — would you share it?"},
    {q:"Is there something health-related that's started to weigh on you recently?", f:"When you hear health news about people around you, what thought passes through your mind?"},
    {q:"What time of day does your body feel most at ease?", f:"What does it feel like in your body then?"},
    {q:"Have you started any new medication or health routine recently?", f:"When and how do you do it?"},
    {q:"How is your appetite these days?", f:"Is anything different from how it usually is?"},
    {q:"Have you noticed your stomach feeling settled or unsettled often lately?", f:"Is it tied to certain foods or times of day?"},
    {q:"How has your sleep been lately?", f:"How does your body feel when you wake up?"},
    {q:"Have you noticed any change in how your body moves or feels?", f:"Your hands, knees, back, eyes, ears — is there a spot that's been on your mind?"},
    {q:"Have you started, or started paying more attention to, any daily habit?", f:"After doing it, does anything feel a little different in your body or mind?"}
  ],
  taste: [
    {q:"Is there a food, drink, song, video, or piece of writing you keep coming back to lately?", f:"Do you enjoy it alone, or would you want to share it with someone?"},
    {q:"Is there a habit or small pleasure that's been giving you joy lately?", f:"Would you want to do it a little more often?"},
    {q:"Is there a routine of your own that you've been repeating lately?", f:"How does your state change after you do it?"},
    {q:"Is there a way of doing something that others might not notice, but that you quietly insist on?", f:"Would you want the family to understand that about you?"},
    {q:"Is there something recently you get absorbed in and lose track of time doing?", f:"What kind of energy does it give you?"},
    {q:"What part of the day do you most look forward to lately?", f:"How do you feel in the lead-up to it?"},
    {q:"Have you discovered something new in everyday life recently?", f:"Did you want to tell someone about it?"},
    {q:"Is there a small action you've been quietly keeping up?", f:"Is there a reason you keep doing it?"},
    {q:"When does a moment lately make you feel \"ah, that's better\"?", f:"Could we find ways to make that moment happen a bit more often?"}
  ],
  safety: [
    {q:"Is there something on your mind that you let slide without saying?", f:"Was the reason closer to worry, guilt, or timing?"},
    {q:"Has there been a moment recently when you hesitated whether to contact the family?", f:"What was it you wanted to say then?"},
    {q:"Is there something you'd like to ask one of your family members right now?", f:"Is there a reason you haven't asked yet?"},
    {q:"Is there something you'd like to ask of your family, but carefully?", f:"How could you phrase it so it feels less heavy?"},
    {q:"Was there a word or gesture from family recently that you were grateful for?", f:"Did you say so at the time, or did you keep it to yourself?"},
    {q:"Is there a worry that's been quietly surfacing lately?", f:"Is it a worry you'd rather keep to yourself, or one you'd want to share?"},
    {q:"Has \"being looked after\" felt like \"being intruded on\" recently?", f:"What kind of tone or question made it feel that way?"},
    {q:"How much room is there in your mind these days?", f:"On a scale of 0 to 10, where are you?"},
    {q:"Is there something you'd like to gently share with family right now?", f:"When do you think would be the easiest time to say it?"}
  ]
}
};
const DEMO_BY_LANG = {
  ko: [
  {name:"엄마", topic:"space",  q:"space-1",  a:"a02", answer:"창가 소파에 앉아 아침 햇살 받는 게 제일 편해.",       date:"2026.05.18", color:TCOLORS.space},
  {name:"아빠", topic:"body",   q:"body-1",   a:null,  answer:"", video: MEDIA_BASE+"trace-video.mp4",                 date:"2026.05.19", color:TCOLORS.body},
  {name:"지원", topic:"safety", q:"safety-3", a:"a03", answer:"", photo: BASE+"trace-photo.png?v=png-mobile-2",                       date:"2026.05.20", color:TCOLORS.safety},
  {name:"오빠", topic:"taste",  q:"taste-9",  a:null,  answer:"", voice: MEDIA_BASE+"trace-voice.mp3",                       date:"2026.05.21", color:TCOLORS.taste},
  {name:"현",   topic:"taste",  q:"taste-1",  a:"a04", answer:"보리차 한 잔이면 충분해. 자기 전에.",                    date:"2026.05.21", color:TCOLORS.taste},
  {name:"딸",   topic:"safety", q:"safety-1", a:"a02", answer:"피곤할 때 짐이 되기 싫어서 말을 못 꺼낼 때가 있어.",    date:"2026.05.22", color:TCOLORS.safety}
],
  en: [
  {name:"Mom",      topic:"space",  q:"space-1",  a:"a02", answer:"Sitting on the window sofa catching morning light is most comfortable.",       date:"2026.05.18", color:TCOLORS.space},
  {name:"Dad",      topic:"body",   q:"body-1",   a:null,  answer:"", video: MEDIA_BASE+"trace-video.mp4",                                         date:"2026.05.19", color:TCOLORS.body},
  {name:"Jiwon",    topic:"safety", q:"safety-3", a:"a03", answer:"", photo: BASE+"trace-photo.png?v=png-mobile-2",                                              date:"2026.05.20", color:TCOLORS.safety},
  {name:"Brother",  topic:"taste",  q:"taste-9",  a:null,  answer:"", voice: MEDIA_BASE+"trace-voice.mp3",                                              date:"2026.05.21", color:TCOLORS.taste},
  {name:"Hyun",     topic:"taste",  q:"taste-1",  a:"a04", answer:"A cup of barley tea is enough. Before bed.",                                  date:"2026.05.21", color:TCOLORS.taste},
  {name:"Daughter", topic:"safety", q:"safety-1", a:"a02", answer:"Sometimes I can't bring it up because I don't want to be a burden when tired.", date:"2026.05.22", color:TCOLORS.safety}
]
};
const INVITE_MSG_BY_LANG = {
  ko: {
    a01: "의견을 존중하며 들어주세요.",
    a02: "한 번에 한 가지만 물어봐 주세요.",
    a03: "비슷한 경험을 짧게 나눠주세요.",
    a04: "조언보다 듣기가 필요해요.",
    a05: "판단 없이 있는 그대로 들어주세요.",
    a06: "오늘은 이정도만 말할게요."
  },
  en: {
    a01: "Please just listen with respect.",
    a02: "Please ask one thing at a time.",
    a03: "Share briefly, don't compare.",
    a04: "Listening matters more than advice.",
    a05: "Listen without judgement, as it is.",
    a06: "This is enough for today, thank you."
  }
};

// ===== Active language + aliases (reassigned by setLanguage) =====
let CURRENT_LANG = localStorage.getItem("jungone_lang") || (navigator.language && navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en");
let TNAMES = TNAMES_BY_LANG[CURRENT_LANG];
let ANAMES = ANAMES_BY_LANG[CURRENT_LANG];
let ADESC = ADESC_BY_LANG[CURRENT_LANG];
let QDATA = QDATA_BY_LANG[CURRENT_LANG];
let DEMO  = DEMO_BY_LANG[CURRENT_LANG];
let INVITE_MSG = INVITE_MSG_BY_LANG[CURRENT_LANG];

// ===== I18N for UI strings =====
const I18N = {
  ko: {
    cover_enter: "정원 들어가기 →",
    intro_title: "정원: The Garden",
    intro_p1: "가족의 대화를<br>작은 정원처럼 가꿉니다.",
    intro_p2: "고치거나 설득하기보다,<br>필요한 거리를 함께 맞추는 일.",
    intro_p3: "묻고 싶은 것이 있다면<br>그것으로 시작하세요.",
    intro_p4: "말문이 막히면<br>정원 카드를 펼쳐보세요.",
    intro_p5: "말하지 않는 것도 대답이고,<br>남기지 않는 것도 선택입니다.",
    intro_btn: "정원 초대장 만들기 →",
    path_afar_title: "멀리서",
    path_afar_desc: "작은 질문으로 떨어져 있어도 서로의 일상과 상태를 이어갑니다.",
    path_f2f_title: "가까이서",
    path_f2f_desc: "함께 있을 때만 꺼낼 수 있는 질문으로 더 느리고 깊은 대화를 나눕니다.",
    f2f_cat_heading: "카드 색을 골라주세요",
    f2f_cat_sub: "카드의 색이나 주제를 골라주세요.",
    f2f_card_heading: "사용했던 카드를 골라주세요",
    f2f_plant_btn: "정원에 심기 →",
    f2f_trace_heading: "함께한 대화에서 무엇을 정원에 남기고 싶나요?",
    f2f_trace_sub: "대화 전체가 아니라, 다시 돌아보고 싶은 흔적만 남겨주세요.",
    step_ask: "묻기",
    step_read: "읽기",
    step_listen: "듣기",
    step_keep: "남기기",
    btn_back: "← 뒤로",
    btn_next: "다음 →",
    s6_heading: "답을 떠올린 뒤,<br>듣고 싶은 방식을 골라주세요",
    s6_invite_btn: "초대장 만들기 →",
    modal_trace_q: "흔적을 같이 남기시겠어요?",
    modal_btn_yes: "흔적 남기기",
    modal_btn_no: "질문만 심기",
    s8_placeholder: "오늘 마음에 남은 것을 적어주세요.",
    s8_or: "또는",
    s8_upload_label: "사진 · 영상 · 음성 파일",
    s8_upload_cta: "눌러서 선택하기",
    s8_remove: "× 파일 지우기",
    s8_plant: "정원에 심기 →",
    garden_title: "정원: The Garden",
    garden_sub_tpl: "정원에 {n}개의 흔적이 자라고 있어요",
    garden_reset: "또 가꾸러 가볼까요?",
    garden_hint: "가족이 흔적을 심으면, 여기에 자라납니다.",
    s7b_mark: "정원 초대장",
    s7b_listen_intro: "오늘은 ",
    s7b_listen_period: ".",
    s7b_save: "이미지로 저장하기",
    s7b_plant: "정원에 심기 →",
    s7b_tip: "정원 초대장을 보내,<br>대화를 시작해 보세요.",
    s7b_saving: "이미지 만드는 중…",
    s7b_saved_ok: "✓ 저장되었어요. 가족에게 이미지를 보내주세요.",
    s7b_save_fail: "저장에 실패했어요. 스크린샷으로 저장해 주세요.",
    s7b_save_screenshot: "스크린샷으로 저장해 주세요.",
    flash_planted_a: "오늘의 질문이<br>정원에 심어졌습니다.",
    flash_planted_b: "언젠가 다시 새로운 질문으로 돌아올 수 있어요.",
    flash_uploading: "파일을 정원에 올리는 중...",
    bubble_photo: "(사진 흔적)",
    bubble_video: "(영상 흔적)",
    bubble_voice: "(음성 흔적)",
    bubble_none: "(흔적만 남김)",
    bubble_playing: "▶ 재생 중",
    bubble_voicetrace: "음성 흔적",
    bubble_empty_trace: "",
    ex_ctrl_heading: "정원에서 만나고 싶은 식물을 골라주세요.",
    ex_ctrl_reset: "초기화",
    modal_pick: "이 카드 선택하기",
    modal_unpick: "선택 해제",
    you_name: "나",
    upload_fail_alert: "파일 업로드에 실패했어요. 텍스트만 심을게요.",
    download_filename: "jungone-초대장.png"
  },
  en: {
    cover_enter: "Enter the Garden →",
    intro_title: "JUNG ONE: The Garden",
    intro_p1: "Tending family conversations<br>like a small garden.",
    intro_p2: "Rather than fixing or convincing,<br>finding the right distance together.",
    intro_p3: "If you have something to ask,<br>start with it.",
    intro_p4: "If words are hard to find,<br>open the garden cards.",
    intro_p5: "Not speaking is also an answer.<br>Not leaving a trace is also a choice.",
    intro_btn: "Create a garden invitation →",
    path_afar_title: "Apart",
    path_afar_desc: "Keep everyday connection alive through small questions, even when you are apart.",
    path_f2f_title: "Together",
    path_f2f_desc: "Use questions made for slower and deeper conversations when you are together.",
    f2f_cat_heading: "Choose a card colour",
    f2f_cat_sub: "Choose its colour or topic.",
    f2f_card_heading: "Choose the card you used",
    f2f_plant_btn: "Plant in the garden →",
    f2f_trace_heading: "What would you like to keep from the conversation you shared?",
    f2f_trace_sub: "Keep only the trace you may want to return to, rather than the whole conversation.",
    step_ask: "Ask",
    step_read: "Read",
    step_listen: "Listen",
    step_keep: "Keep",
    btn_back: "← Back",
    btn_next: "Next →",
    s6_heading: "After your thought,<br>choose how you'd like to be heard",
    s6_invite_btn: "Create invitation →",
    modal_trace_q: "Would you like to leave a trace?",
    modal_btn_yes: "Leave a trace",
    modal_btn_no: "Plant the question only",
    s8_placeholder: "What stayed with you today?",
    s8_or: "or",
    s8_upload_label: "Photo · Video · Voice",
    s8_upload_cta: "Tap to choose",
    s8_remove: "× Remove file",
    s8_plant: "Plant in garden →",
    garden_title: "JUNG ONE: The Garden",
    garden_sub_tpl: "{n} traces growing in the garden",
    garden_reset: "Tend again?",
    garden_hint: "When family plants a trace, it grows here.",
    s7b_mark: "Garden invitation",
    s7b_listen_intro: "Today is ",
    s7b_listen_period: ".",
    s7b_save: "Save as image",
    s7b_plant: "Plant in garden →",
    s7b_tip: "Send a garden invitation,<br>start a conversation.",
    s7b_saving: "Creating image…",
    s7b_saved_ok: "✓ Saved. Send the image to your family.",
    s7b_save_fail: "Save failed. Please screenshot instead.",
    s7b_save_screenshot: "Please screenshot instead.",
    flash_planted_a: "Today's question<br>has been planted.",
    flash_planted_b: "It may return as a new question someday.",
    flash_uploading: "Uploading to garden...",
    bubble_photo: "(photo trace)",
    bubble_video: "(video trace)",
    bubble_voice: "(voice trace)",
    bubble_none: "(trace only)",
    bubble_playing: "▶ playing",
    bubble_voicetrace: "voice trace",
    bubble_empty_trace: "",
    ex_ctrl_heading: "Choose a plant you would like to meet in the garden.",
    ex_ctrl_reset: "Reset",
    modal_pick: "Pick this card",
    modal_unpick: "Unpick",
    you_name: "You",
    upload_fail_alert: "Upload failed. Planting text only.",
    download_filename: "jungone-invitation.png"
  }
};

function t(key, vars){
  let s = (I18N[CURRENT_LANG] && I18N[CURRENT_LANG][key]) || (I18N.ko[key] || key);
  if(vars){
    Object.keys(vars).forEach(k => { s = s.replace("{" + k + "}", vars[k]); });
  }
  return s;
}

function applyI18nToHTML(){
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if(I18N[CURRENT_LANG][key] !== undefined) el.innerHTML = I18N[CURRENT_LANG][key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if(I18N[CURRENT_LANG][key] !== undefined) el.setAttribute("placeholder", I18N[CURRENT_LANG][key]);
  });
  document.documentElement.lang = CURRENT_LANG;
  const tog = document.getElementById("langToggle");
  if(tog) tog.textContent = CURRENT_LANG === "ko" ? "EN" : "KR";
}

function setLanguage(lang){
  if(lang !== "ko" && lang !== "en") return;
  CURRENT_LANG = lang;
  localStorage.setItem("jungone_lang", lang);
  TNAMES = TNAMES_BY_LANG[lang];
  ANAMES = ANAMES_BY_LANG[lang];
  ADESC = ADESC_BY_LANG[lang];
  QDATA = QDATA_BY_LANG[lang];
  INVITE_MSG = INVITE_MSG_BY_LANG[lang];
  // Reload demo entries (only the demo subset; user's Firebase entries keep their text)
  const newDemo = DEMO_BY_LANG[lang];
  // Replace the demo-prefix portion of entries
  if(entries && entries.length){
    const demoLen = DEMO.length;
    entries = newDemo.concat(entries.slice(demoLen));
    DEMO = newDemo;
    // Keep positions stable across language toggle — only DEMO names/text change.
  } else {
    DEMO = newDemo;
  }
  applyI18nToHTML();
  // Re-render current screen's dynamic content
  const active = document.querySelector(".screen.active");
  if(active){
    const id = active.id;
    if(id === "s2") rebuildTopicCards();
    else if(id === "s3") rebuildQuestionCards();
    else if(id === "s6") rebuildConvScreen();
    else if(id === "s7b") rebuildInvitePreview();
    else if(id === "s9"){
      // Exhibition modes: refresh count + idle + open card in new language
      if(document.body.classList.contains("ex-display") || document.body.classList.contains("ex-controller")){
        // count
        var sub = document.getElementById("gardenSub");
        if(sub){
          var n = (typeof exVisiblePlants === "function") ? exVisiblePlants().length : 0;
          sub.textContent = (CURRENT_LANG === "en") ? (n + " traces growing in the garden") : ("정원에 " + n + "개의 흔적이 자라고 있어요");
        }
        // idle instruction text
        if(typeof updateExIdleText === "function") updateExIdleText();
        // re-render an open card/trace
        var bub = document.getElementById("answerBubble");
        if(bub && bub.classList.contains("show") && typeof exSelectedPlantId !== "undefined" && exSelectedPlantId){
          if(document.body.classList.contains("ex-controller") && typeof showControllerQuestion === "function") showControllerQuestion(exSelectedPlantId);
          else if(typeof showExhibitionTrace === "function") showExhibitionTrace(exSelectedPlantId);
        }
      } else {
        buildGarden();
      }
    }
    else if(id === "sf1") buildF2FCategory();
    else if(id === "sf2") buildF2FCards();
  }
}


// Apply saved language on first paint
window.addEventListener("DOMContentLoaded", function(){
  applyI18nToHTML();
});

function toggleLanguage(){
  setLanguage(CURRENT_LANG === "ko" ? "en" : "ko");
  // Exhibition: controller broadcasts language so the TV switches too
  try{
    if(document.body.classList.contains("ex-controller") && EX_REF){
      EX_REF.child("lang").set(CURRENT_LANG);
    }
  }catch(e){}
}


// ===== Re-render helpers used by setLanguage =====
// Safe approach: re-render only the garden (data-driven). For card-based
// screens (s2/s3/s6/s7b), the user can simply press back then forward
// to refresh, since rebuild functions vary across the codebase.
function rebuildTopicCards(){ if(typeof go === "function") go("s2"); }
function rebuildQuestionCards(){ if(S.topic && typeof go === "function") go("s3"); }
function rebuildConvScreen(){ if(S.topic && S.question && typeof go === "function") go("s6"); }
function rebuildInvitePreview(){
  // Re-populate the dynamic parts of the invitation card
  if(S.topic && S.question && typeof createInvitation === "function"){
    // Save current display, repopulate, but stay on s7b
    const wasActive = document.getElementById("s7b").classList.contains("active");
    if(wasActive){
      // Just refresh the texts/images, don't re-navigate
      const t = S.topic, idx = S.questionIdx;
      const ccImgT = document.getElementById("icpImgT");
      if(ccImgT) ccImgT.src = OFFCARDS_BACK[t];
      const ccImgQ = document.getElementById("icpImgQ");
      if(ccImgQ) ccImgQ.src = qcardSrc(t, idx);
      const qData = QDATA[t][idx];
      if(qData){
        const qEl = document.getElementById("icpQ");
        const sEl = document.getElementById("icpSub");
        if(qEl) qEl.textContent = qData.q;
        if(sEl) sEl.textContent = qData.f || "";
      }
      const nameEl = document.getElementById("icpListenName");
      if(nameEl && S.listenCard) nameEl.textContent = "'" + ANAMES[S.listenCard] + "'";
      const msgEl = document.getElementById("icpListenMsg");
      if(msgEl && S.listenCard) msgEl.textContent = INVITE_MSG[S.listenCard] || ADESC[S.listenCard];
    }
  }
}


// ===== Original data block continues below for backward-compatibility =====



// ===== Display mode check — runs FIRST, no Firebase dependency =====
// Accept many URL patterns so the big-screen mode is hard to miss:
//   ?display=garden, ?mode=garden, ?garden, #garden, or path ending /garden
function detectDisplayMode(){
  const url = window.location.href;
  const params = new URLSearchParams(window.location.search);
  if(params.get("display") === "garden") return true;
  if(params.get("mode") === "garden") return true;
  if(params.has("garden")) return true;
  if(window.location.hash === "#garden") return true;
  if(window.location.pathname.endsWith("/garden")) return true;
  return false;
}
const IS_DISPLAY_MODE = detectDisplayMode();
console.log("[JungOne] URL:", window.location.href);
console.log("[JungOne] Display mode:", IS_DISPLAY_MODE);

// ===== Exhibition mode detection (Phase 1) =====
const EX_PARAMS = new URLSearchParams(window.location.search);
const EX_MODE = EX_PARAMS.get("mode") || "public";   // public | controller | display
const EX_ROOM = EX_PARAMS.get("room") || "graduation2026";
console.log("[JungOne] Exhibition mode:", EX_MODE, "room:", EX_ROOM);

// Temporary local selection state (Phase 1; replaced by Firebase in Phase 3)
let exSelectedPlantId = null;

// Track positions so existing plants don't jump on each update
const positionsByKey = {};
// Track which keys we've already seen so new ones bloom in
const seenKeys = new Set();

// ===== Firebase setup (graceful failure if blocked) =====
const firebaseConfig = {
  apiKey: "AIzaSyCwWe7u9t7egHfqaWYlGY-6eAq8YlI7VPc",
  authDomain: "jungone-3f285.firebaseapp.com",
  databaseURL: "https://jungone-3f285-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jungone-3f285",
  storageBucket: "jungone-3f285.firebasestorage.app",
  messagingSenderId: "841576869762",
  appId: "1:841576869762:web:78496fdfbc0bd2f523699b"
};
let fdb = null, fst = null, ENTRIES_REF = null;
async function initFirebase(){
  // Wait for SDK loader (handles gstatic OR jsdelivr fallback)
  const ready = await (window._fbReady || Promise.resolve(false));
  if(!ready || typeof firebase === "undefined"){
    console.error("Firebase SDK could not load — running in offline mode");
    return;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    fdb = firebase.database();
    fst = firebase.storage();
    ENTRIES_REF = fdb.ref("entries");
    console.log("✓ Firebase connected");
    // Now safe to start listener
    startFirebaseListener();
  } catch(err){
    console.error("Firebase init failed:", err);
  }
}


// ============================================================
// Phase 3 — Exhibition realtime link (iPad controller ↔ TV display)
// Reuses the existing firebaseConfig + _fbReady. Separate ref from entries.
// State path: /exhibition/jungone/rooms/{room}/current
// ============================================================
let EX_REF = null;            // realtime ref to this room's "current" state
let exConnDisplayed = "connecting";  // controller connection indicator state
let exLastApplied = { plantId: null, at: 0 };  // display de-dupe

async function initExhibitionLink(role){
  // role: "controller" | "display"
  const ready = await (window._fbReady || Promise.resolve(false));
  if(!ready || typeof firebase === "undefined"){
    console.error("[Exhibition] Firebase SDK not available — link disabled");
    if(role === "controller") setExConn("disconnected");
    return;  // public/display still work; display just stays on full garden
  }
  try {
    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
    if(!fdb) fdb = firebase.database();
    EX_REF = fdb.ref("exhibition/jungone/rooms/" + EX_ROOM + "/current");
    console.log("[Exhibition] linked path:", "exhibition/jungone/rooms/" + EX_ROOM + "/current");

    // Connection indicator (controller only) via .info/connected
    if(role === "controller"){
      setExConn("connecting");
      fdb.ref(".info/connected").on("value", (snap) => {
        setExConn(snap.val() === true ? "connected" : "disconnected");
      });
    }

    if(role === "display"){
      subscribeExhibitionState();
    }
  } catch(err){
    console.error("[Exhibition] init failed:", err);
    if(role === "controller") setExConn("disconnected");
  }
}

// ---------- Controller: write selection ----------
function exControllerSelect(plantId){
  // Confirm the plant exists in curated data
  const e = exFindPlant(plantId);
  if(!e){ console.warn("[Exhibition] unknown plantId:", plantId); return; }

  exSelectedPlantId = plantId;
  // White highlight on the selected plant (controller garden)
  document.querySelectorAll("#seedsContainer .seed-layer").forEach(s => {
    s.classList.toggle("selected", s.dataset.plantId === plantId);
  });
  // CONTROLLER shows the QUESTION card on its own screen
  showControllerQuestion(plantId);
  if(!EX_REF){
    exToast(exMsg("link_fail"), true);
    return;
  }
  const payload = {
    selectedPlantId: plantId,
    command: "showTrace",
    selectedAt: Date.now(),
    controllerSession: exSessionId()
  };
  EX_REF.set(payload)
    .then(() => { exToast(exMsg("opened"), false); })
    .catch((err) => { console.error("[Exhibition] write failed:", err); exToast(exMsg("link_fail"), true); });
}

// Controller-only: show the selected plant's QUESTION as a CARD (card asks the question)
function showControllerQuestion(plantId){
  const e = exFindPlant(plantId);
  if(!e) return;
  const bub = document.getElementById("answerBubble");
  const inner = document.getElementById("bubbleInner");
  if(!bub || !inner) return;
  const lang = CURRENT_LANG;
  // Use the real physical card image (offcard) as the big card background
  const cardImg = e.cardImage || e.plantImage;
  const catLabel = (typeof CONV_CAT !== "undefined" && e.color && CONV_CAT[e.color]) ? CONV_CAT[e.color] : "";
  // A question card: real card image + theme (top) + question + JUNG ONE (bottom)
  inner.innerHTML =
    '<div class="ex-qcard">' +
      '<img class="ex-qcard-bg" src="' + cardImg + '" alt=""/>' +
      '<div class="ex-qcard-body">' +
        (catLabel ? '<div class="ex-qcard-cat">' + catLabel + '</div>' : '') +
        '<div class="ex-qcard-q">"' + exQ(e, lang) + '"</div>' +
        '<div class="ex-qcard-brand">JUNG ONE</div>' +
      '</div>' +
    '</div>';
  inner.style.background = "transparent";
  inner.style.borderColor = "transparent";
  bub.classList.add("show", "ex-answer-big", "ex-qcard-mode");
  bub.style.left = ""; bub.style.top = "";
  const idle = document.getElementById("exIdle");
  if(idle) idle.style.display = "none";
  // Tapping the card itself closes it and returns to the garden
  // (card no longer intercepts clicks — plants stay tappable underneath;
  //  tapping another plant simply replaces the card)
}

function exControllerResetRemote(){
  exSelectedPlantId = null;
  document.querySelectorAll("#seedsContainer .seed-layer").forEach(s => s.classList.remove("selected"));
  // Close the controller's own card + show idle (always, regardless of link)
  const bub = document.getElementById("answerBubble");
  if(bub) bub.classList.remove("show", "ex-answer-big", "ex-qcard-mode", "ex-record");
  const idle = document.getElementById("exIdle"); if(idle) idle.style.display = "flex";
  if(!EX_REF){
    return;
  }
  EX_REF.set({ selectedPlantId: null, command: "idle", selectedAt: Date.now() })
    .then(() => { exToast(exMsg("reset_done"), false); })
    .catch((err) => { console.error("[Exhibition] reset write failed:", err); exToast(exMsg("link_fail"), true); });
}

function exSessionId(){
  if(!window._exSession) window._exSession = "s-" + Math.random().toString(36).slice(2,8);
  return window._exSession;
}

// ---------- Display: subscribe + react ----------
function subscribeExhibitionState(){
  if(!EX_REF) return;
  EX_REF.on("value", (snap) => {
    const st = snap.val();
    if(!st){ exDisplayIdle(); return; }
    // Language sync — display follows controller's language
    if(st.lang && st.lang !== CURRENT_LANG){
      setLanguage(st.lang);
    }
    const cmd = st.command;
    const pid = st.selectedPlantId;
    const at  = st.selectedAt || 0;

    // Ignore stale state (older than 60s) on (re)load
    if(Date.now() - at > 60000){
      console.log("[Exhibition] stale state ignored");
      exDisplayIdle();
      return;
    }
    if(cmd === "showTrace" && pid){
      const e = exFindPlant(pid);
      if(!e){
        console.warn("[Exhibition] invalid plantId from state:", pid);
        exDisplayIdle();
        return;
      }
      // React when plant OR timestamp changes (repeat taps reopen)
      if(exLastApplied.plantId === pid && exLastApplied.at === at) return;
      exLastApplied = { plantId: pid, at: at };
      showExhibitionTrace(pid);   // existing function + 25s auto-close
    } else {
      // idle / null
      exLastApplied = { plantId: null, at: at };
      exDisplayIdle();
    }
  }, (err) => {
    console.error("[Exhibition] subscribe error:", err);
    // keep full garden visible on error
  });
}

function exDisplayIdle(){
  const bub = document.getElementById("answerBubble");
  if(bub) bub.classList.remove("show");
  const idle = document.getElementById("exIdle");
  if(idle) idle.style.display = "flex";
  if(exTraceTimer) clearTimeout(exTraceTimer);
  // clear selection highlight on the display garden
  document.querySelectorAll("#seedsContainer .seed-layer").forEach(s => s.classList.remove("selected"));
}

// ---------- Controller UI helpers ----------
function setExConn(state){
  exConnDisplayed = state;
  const el = document.getElementById("exConn");
  if(!el) return;
  const dotCls = state === "connected" ? "on" : (state === "connecting" ? "wait" : "off");
  el.className = "ex-conn " + dotCls;
  el.querySelector(".ex-conn-text").textContent = exMsg("conn_" + state);
}
function exMsg(key){
  const ko = {
    opened: "TV에 흔적이 열렸습니다.",
    reset_done: "정원으로 돌아갔습니다.",
    link_fail: "TV와 연결할 수 없습니다. 연결 상태를 확인해주세요.",
    conn_connected: "TV 연결됨",
    conn_connecting: "연결 중",
    conn_disconnected: "연결 끊김"
  };
  const en = {
    opened: "The trace is now open on the TV.",
    reset_done: "Returned to the garden.",
    link_fail: "Unable to connect to the TV. Please check the connection.",
    conn_connected: "TV connected",
    conn_connecting: "Connecting",
    conn_disconnected: "Disconnected"
  };
  return (CURRENT_LANG === "en" ? en : ko)[key] || "";
}
let exToastTimer = null;
function exToast(text, isError){
  let el = document.getElementById("exToast");
  if(!el) return;
  el.textContent = text;
  el.className = "ex-toast show" + (isError ? " error" : "");
  if(exToastTimer) clearTimeout(exToastTimer);
  exToastTimer = setTimeout(() => { el.className = "ex-toast"; }, 3000);
}


let entries = [...DEMO];

// State
let S = {topic:null, question:null, questionIdx:null, qChoices:[], qChoicesByTopic:{}, listenCard:null, invitationLink:null, uploadedFile:null, source:"afar", f2fCat:null, f2fCard:null};

// ===== Navigation =====
function go(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.add("active");
  window.scrollTo(0,0);
  if(id==="s2") buildTopicGrid();
  if(id==="s3") buildQuestionChoices();
  if(id==="s6") buildConv();
  if(id==="s8") buildTraceInput();
  if(id==="s9") buildGarden();
  if(id==="sf1") buildF2FCategory();
  if(id==="sf2") buildF2FCards();
}


// Reset trace input + uploaded file + selections (called when a path starts)
function resetTraceState(){
  S.uploadedFile = null;
  const ta = document.getElementById("traceText");
  if(ta) ta.value = "";
  const prev = document.getElementById("uploadPreview");
  if(prev) prev.classList.remove("show");
  const box = document.getElementById("uploadBox");
  if(box) box.style.display = "";
  const cardTop = document.getElementById("traceCardTop");
  if(cardTop){
    cardTop.style.display = "none";
    cardTop.innerHTML = "";   // remove any image layers entirely
  }
}

// ===== Path entry points (from intro) =====
function startAfar(){
  S.source = "afar";
  resetTraceState();
  go("s2");
}
function startFaceToFace(){
  S.source = "faceToFace";
  S.f2fCat = null;
  S.f2fCard = null;
  resetTraceState();
  go("sf1");
}

// ===== F1 — Physical card category select (reuse 4 category images) =====
function buildF2FCategory(){
  const row = document.getElementById("f2fCatRow");
  row.innerHTML = "";
  document.getElementById("btnSf1").disabled = (S.f2fCat === null || S.f2fCat === undefined);
  // Reuse the same 4 category/topic images (TSRCS) — keyed by color
  const cats = [
    {color:"bl", topic:"space"},
    {color:"gn", topic:"body"},
    {color:"pk", topic:"taste"},
    {color:"yw", topic:"safety"}
  ];
  cats.forEach(({color, topic}) => {
    const c = document.createElement("button");
    c.className = "topic-card";
    if(S.f2fCat === color) c.classList.add("on");
    c.innerHTML = `<img class="tc-img" src="${TSRCS[topic]}" alt=""/>`;
    c.onclick = () => {
      row.querySelectorAll(".topic-card").forEach(x=>x.classList.remove("on"));
      c.classList.add("on");
      S.f2fCat = color;
      // Reset card selection when category changes
      S.f2fCard = null;
      document.getElementById("btnSf1").disabled = false;
    };
    row.appendChild(c);
  });
}

// ===== F2 — Show ALL physical cards in the selected category =====
function buildF2FCards(){
  const row = document.getElementById("f2fCardRow");
  row.innerHTML = "";
  document.getElementById("btnSf2").disabled = (S.f2fCard === null || S.f2fCard === undefined);
  const cat = S.f2fCat;
  const files = (OFFCARD_FILES[cat] || []);
  files.forEach(code => {
    const c = document.createElement("button");
    c.className = "qcard f2f-card";
    if(S.f2fCard === code) c.classList.add("on");
    // Physical card = its cardImage (offcard{code}.png?v=png-mobile-2), shown full
    c.innerHTML = `<img class="qc-front" src="${offCardImg(code)}" alt=""/>`;
    c.onclick = () => {
      row.querySelectorAll(".qcard").forEach(x=>x.classList.remove("on"));
      c.classList.add("on");
      S.f2fCard = code;
      document.getElementById("btnSf2").disabled = false;
    };
    row.appendChild(c);
  });
}

// (F2F now goes through the standard plantModal — same as the afar path.
//  buildTraceInput() shows the selected physical card at the top of S8.)

// ===== S2 — Topic =====
function buildTopicGrid(){
  const row = document.getElementById("topicRow");
  row.innerHTML = "";
  document.getElementById("btnS2").disabled = (S.topic === null);
  Object.keys(TNAMES).forEach(key => {
    const c = document.createElement("button");
    c.className = "topic-card";
    if(S.topic === key) c.classList.add("on");
    // Single oncard{color}-topic.png?v=png-mobile-2 image
    c.innerHTML = `<img class="tc-img" src="${TSRCS[key]}" alt=""/>`;
    c.onclick = () => {
      row.querySelectorAll(".topic-card").forEach(x=>x.classList.remove("on"));
      c.classList.add("on");
      S.topic = key;
      document.getElementById("btnS2").disabled = false;
    };
    row.appendChild(c);
  });
}

// ===== S3 — 3 random Q cards =====
function buildQuestionChoices(){
  const row = document.getElementById("qcardRow");
  row.innerHTML = "";

  // Random 3 generated once per topic per round.
  // Going back keeps the same 3. Only "또 가꾸러 가볼까요?" reset clears them.
  if(!S.qChoicesByTopic[S.topic]){
    const indices = [0,1,2,3,4,5,6,7,8];
    for(let i=indices.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [indices[i],indices[j]] = [indices[j],indices[i]];
    }
    S.qChoicesByTopic[S.topic] = indices.slice(0,2);
  }
  S.qChoices = S.qChoicesByTopic[S.topic];

  // If returning with a previous selection in this topic, restore it
  const previouslySelected = S.questionIdx;

  S.qChoices.forEach(idx => {
    const c = document.createElement("button");
    c.className = "qcard";
    if(previouslySelected === idx) c.classList.add("on");
    const color = TOPIC_COLOR[S.topic];
    const frontSrc = BASE + "oncard" + color + "-front.png?v=png-mobile-2";
    const plantSrc = qcardSrc(S.topic, idx);
    c.innerHTML = `<img class="qc-front" src="${frontSrc}" alt=""/><img class="qc-plant" src="${plantSrc}" alt=""/>`;
    c.onclick = () => {
      row.querySelectorAll(".qcard").forEach(x=>x.classList.remove("on"));
      c.classList.add("on");
      S.question = S.topic + "-" + (idx+1);
      S.questionIdx = idx;
      document.getElementById("btnS3").disabled = false;
    };
    row.appendChild(c);
  });

  // Add 2 invisible placeholders so the 2 cards sit in the EXACT same
  // grid positions as the top row of S2's 4-card layout
  for(let i = 0; i < 2; i++){
    const ph = document.createElement("div");
    ph.className = "qcard-placeholder";
    ph.setAttribute("aria-hidden", "true");
    row.appendChild(ph);
  }

  // Enable Next if previously selected card is in current choices
  if(previouslySelected !== null && S.qChoices.includes(previouslySelected)){
    document.getElementById("btnS3").disabled = false;
  } else {
    document.getElementById("btnS3").disabled = true;
    S.question = null;
    S.questionIdx = null;
  }
}

// ===== S4 — Read =====
function buildReadCard(){
  const t = S.topic, idx = S.questionIdx;
  document.getElementById("rcImgT").src = OFFCARDS_BACK[t];
  document.getElementById("rcImgQ").src = qcardSrc(t, idx);
  const qData = QDATA[t][idx];
  document.getElementById("rcQ").textContent = qData.q;
  document.getElementById("rcSub").textContent = qData.f || "";
}


// ===== S6 — Conversation =====
const CONV_CAT = {
  bl: "TASTE & JOY",
  gn: "HOME & SPACE",
  pk: "CARE & CONNECTION",
  yw: "BODY & SENSES"
};
// Color-code → hex (for exhibition record accents)
const TCOLORS_BY_CODE = {
  bl: "#6db0d8",   // blue
  gn: "#7bc86c",   // green
  pk: "#b89cd8",   // purple
  yw: "#e8b84a"    // yellow
};
function buildConv(){
  const t = S.topic, idx = S.questionIdx;
  // Selected card = off-card back (color-matched) + chosen oncard on top
  document.getElementById("ccImgT").src = OFFCARDS_BACK[t];
  document.getElementById("ccImgQ").src = qcardSrc(t, idx);
  const color = TOPIC_COLOR[t];
  const catEl = document.getElementById("ccCat");
  if(catEl) catEl.textContent = CONV_CAT[color] || "";
  const qData = QDATA[t][idx];
  document.getElementById("ccQ").textContent = qData.q;
  document.getElementById("ccSub").textContent = qData.f || "";
  buildConvListen();
}
function buildConvListen(){
  const row = document.getElementById("convListenRow");
  row.innerHTML = "";
  ["a01","a02","a03","a04","a05","a06"].forEach(key => {
    const c = document.createElement("button");
    c.className = "conv-listen-card";
    if(S.listenCard === key) c.classList.add("on");
    c.onclick = () => openListenModal(key);
    c.innerHTML = `<img class="lc-back" src="${BASE}listencard-front-empty.png?v=png-mobile-2" alt=""/><img class="lc-content" src="${ASRCS[key]}" alt=""/><span class="lc-name">${ANAMES[key]}</span>`;
    row.appendChild(c);
  });
  updateInviteBtn();
}

let _currentModalKey = null;
function openListenModal(key){
  _currentModalKey = key;
  document.getElementById("lmBack").src = BASE + "listencard-back-empty.png?v=png-mobile-2";
  document.getElementById("lmImg").src = ASRCS[key];
  document.getElementById("lmName").textContent = ANAMES[key];
  document.getElementById("lmDesc").textContent = ADESC[key];
  // Update select button label based on selection state
  const selBtn = document.getElementById("lmSelectBtn");
  if(S.listenCard === key){
    selBtn.textContent = t("modal_unpick");
    selBtn.classList.add("btn-outline");
  } else {
    selBtn.textContent = t("modal_pick");
    selBtn.classList.remove("btn-outline");
  }
  document.getElementById("listenModal").classList.add("show");
}
function closeListenModal(){
  document.getElementById("listenModal").classList.remove("show");
  _currentModalKey = null;
}
function selectListenCard(){
  if(!_currentModalKey) return;
  if(S.listenCard === _currentModalKey){
    S.listenCard = null;
  } else {
    S.listenCard = _currentModalKey;
  }
  closeListenModal();
  buildConvListen();
}
function updateInviteBtn(){
  const btn = document.getElementById("btnS6");
  if(btn) btn.disabled = !S.listenCard;
}

// ===== Planting flow =====
function openPlantModal(){
  document.getElementById("plantModal").classList.add("show");
}
function closePlantModal(){
  document.getElementById("plantModal").classList.remove("show");
}
function todayStr(){
  const d = new Date();
  return d.getFullYear() + "." + String(d.getMonth()+1).padStart(2,'0') + "." + String(d.getDate()).padStart(2,'0');
}
function plantOnly(){
  const entry = makeBaseEntry("");
  pushToFirebase(entry);
  showFlashAndGoGarden();
}

// Build the entry object for either path (afar / faceToFace)
function makeBaseEntry(answer){
  if(S.source === "faceToFace"){
    const topicKey = OFFCAT_TOPIC[S.f2fCat] || "taste";
    const col = TCOLORS[topicKey] || '#9aab9e';
    return {
      name: t("you_name"),
      source: "faceToFace",
      topic: topicKey,
      f2fCard: S.f2fCard || null,   // e.g. "gn3-10"
      q: null,
      a: null,
      answer: answer,
      date: todayStr(),
      color: col
    };
  }
  // afar (existing)
  const col = TCOLORS[S.topic] || '#9aab9e';
  return {
    name: t("you_name"),
    source: "afar",
    topic: S.topic,
    q: S.question,
    a: S.listenCard || null,
    answer: answer,
    date: todayStr(),
    color: col
  };
}

async function plantWithTrace(){
  const answer = document.getElementById("traceText").value.trim();
  const entry = makeBaseEntry(answer);

  // Upload media file to Firebase Storage (if any), then attach URL
  if(S.uploadedFile && S.uploadedFile.file){
    try{
      setFlashText(t("flash_uploading"));
      const url = await uploadFileToStorage(S.uploadedFile.file);
      const t = S.uploadedFile.type;
      if(t.startsWith("image/")) entry.photo = url;
      else if(t.startsWith("video/")) entry.video = url;
      else if(t.startsWith("audio/")) entry.voice = url;
    } catch(err){
      console.error("Upload failed:", err);
      alert(t("upload_fail_alert"));
    }
  }
  pushToFirebase(entry);
  S.uploadedFile = null;
  showFlashAndGoGarden();
}

function setFlashText(msg){
  const f = document.getElementById("sFlash");
  const t = f.querySelector(".ft");
  if(t) t.innerHTML = msg;
  f.classList.add("show");
}

function pushToFirebase(entry){
  if(!ENTRIES_REF){
    // No Firebase available — just add locally
    entries.push(entry);
    if(document.getElementById("s9").classList.contains("active")) buildGarden();
    return;
  }
  ENTRIES_REF.push(entry).catch(err => {
    console.error("DB push failed:", err);
    entries.push(entry);
    if(document.getElementById("s9").classList.contains("active")) buildGarden();
  });
}

// Image resize before upload (1280px max width) for fast transfer
async function resizeImage(file, maxWidth = 1280, quality = 0.85){
  if(!file.type.startsWith("image/")) return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if(w > maxWidth){
          h = h * (maxWidth / w);
          w = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => resolve(blob || file), "image/jpeg", quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

async function uploadFileToStorage(file){
  if(!fst) throw new Error("Storage not available");
  const optimized = await resizeImage(file);
  const ext = file.name.split('.').pop() || (file.type.split('/')[1]) || 'bin';
  const path = "traces/" + Date.now() + "-" + Math.random().toString(36).slice(2,8) + "." + ext;
  const ref = fst.ref(path);
  const snap = await ref.put(optimized);
  return await snap.getDownloadURL();
}
function showFlashAndGoGarden(){
  const f = document.getElementById("sFlash");
  f.classList.add("show");
  setTimeout(() => {
    f.classList.remove("show");
    go("s9");
    resetTraceState();   // clear for next round
  }, 2400);
}

// ===== S8 — Trace =====
function s8GoBack(){
  if(S.source === "faceToFace") go("sf2");
  else go("s6");
}
function buildTraceInput(){
  document.getElementById("traceText").value = "";
  const cardTop = document.getElementById("traceCardTop");
  if(cardTop){
    if(S.source === "faceToFace" && S.f2fCard){
      // OFFLINE: just the single completed offcard image — one <img>, no layers, no frame
      cardTop.className = "trace-card-top is-single";
      cardTop.style.display = "block";
      cardTop.innerHTML = '<img class="tct-solo" src="' + offCardImg(S.f2fCard) + '" alt=""/>';
    } else if(S.source === "afar" && S.topic && (S.questionIdx !== null && S.questionIdx !== undefined)){
      // ONLINE: composed card = back-empty bg + plant overlay (two layers)
      cardTop.className = "trace-card-top";
      cardTop.style.display = "block";
      cardTop.innerHTML =
        '<img class="tct-bg" src="' + OFFCARDS_BACK[S.topic] + '" alt=""/>' +
        '<img class="tct-plant" src="' + qcardSrc(S.topic, S.questionIdx) + '" alt=""/>';
    } else {
      cardTop.style.display = "none";
      cardTop.innerHTML = "";
    }
  }
  document.getElementById("traceCount").textContent = "0";
  clearFile();
}
function updateCounter(){
  const v = document.getElementById("traceText").value;
  document.getElementById("traceCount").textContent = String(v.length);
}
function onFilePicked(input){
  if(!input.files || !input.files[0]) return;
  const f = input.files[0];
  const url = URL.createObjectURL(f);
  S.uploadedFile = {type:f.type, url:url, name:f.name, file:f};
  document.getElementById("fileName").textContent = f.name;
  document.getElementById("uploadPreview").classList.add("show");
  document.getElementById("uploadBox").style.display = "none";
}
function clearFile(){
  S.uploadedFile = null;
  document.getElementById("fileInput").value = "";
  document.getElementById("uploadPreview").classList.remove("show");
  document.getElementById("uploadBox").style.display = "";
}




// ===== Invitation system =====
// ===== Invitation card =====
// Short, invite-friendly listening messages (different from ADESC)

function createInvitation(){
  // Populate the invitation card preview
  const t = S.topic, idx = S.questionIdx;
  document.getElementById("icpImgT").src = OFFCARDS_BACK[t];
  document.getElementById("icpImgQ").src = qcardSrc(t, idx);
  const qData = QDATA[t][idx];
  document.getElementById("icpQ").textContent = qData.q;
  document.getElementById("icpSub").textContent = qData.f || "";
  document.getElementById("icpListenName").textContent = "'" + ANAMES[S.listenCard] + "'";
  document.getElementById("icpListenMsg").textContent = INVITE_MSG[S.listenCard] || ADESC[S.listenCard];
  // Category sub-line under 정원 초대장 — same color-based label as the conv-card
  const color = TOPIC_COLOR[t];
  const catEl = document.getElementById("icpMarkCat");
  if(catEl) catEl.textContent = CONV_CAT[color] || (TNAMES[t] || "").toUpperCase();
  go("s7b");
}

function downloadInvitation(){
  const card = document.getElementById("inviteCardPreview");
  if(typeof html2canvas === "undefined"){
    setTip(t("s7b_save_screenshot"));
    return;
  }
  setTip(t("s7b_saving"));
  // High-res: 3x scale + devicePixelRatio for crisp output
  const scale = Math.max(3, (window.devicePixelRatio || 1) * 2);
  html2canvas(card, {
    backgroundColor: "#0e0c09",
    scale: scale,
    useCORS: true,
    allowTaint: false,        /* avoid tainting canvas */
    logging: false,
    imageTimeout: 15000,
    foreignObjectRendering: false,
    onclone: (clonedDoc) => {
      // Force images to load fresh in clone
      const imgs = clonedDoc.querySelectorAll("#inviteCardPreview img");
      imgs.forEach(img => { img.crossOrigin = "anonymous"; });
    }
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = t("download_filename");
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTip(t("s7b_saved_ok"));
  }).catch(() => {
    setTip(t("s7b_save_fail"));
  });
}
function setTip(msg){
  const el = document.getElementById("inviteTip");
  if(el) el.textContent = msg;
}


// ===== Realtime sync from Firebase =====
function startFirebaseListener(){
  if(!ENTRIES_REF){
    console.warn("Firebase not connected — running in offline mode");
    return;
  }
  ENTRIES_REF.on("value", snapshot => {
    const data = snapshot.val();
    const fbEntries = [];
    if(data){
      Object.keys(data).forEach(key => {
        const e = data[key];
        e._key = key;
        fbEntries.push(e);
      });
    }
    // Merge: DEMO seeds first (anchor garden), then live entries
    entries = [...DEMO, ...fbEntries];

    // If we're on the garden screen, redraw (preserves existing positions)
    const gardenActive = document.getElementById("s9").classList.contains("active");
    if(gardenActive){
      // Exhibition display renders synchronously (no rAF) so it never blanks out.
      if(document.body.classList.contains("ex-display")) renderDisplayGarden();
      else buildGarden();
    }
  });
}

// ===== Display mode (?display=garden) =====
function enterDisplayMode(){
  document.body.classList.add("display-mode");
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("s9").classList.add("active");
  setTimeout(fitGardenStage, 50);
  // Hide the reset button in display mode (it's the big shared screen)
  const btn = document.querySelector("#s9 .bottom");
  if(btn) btn.style.display = "none";
  // Add small hint text
  const hint = document.createElement("div");
  hint.className = "display-hint";
  hint.textContent = t("garden_hint");
  document.getElementById("s9").appendChild(hint);
  buildGarden();
  unlockDisplayAudio();
}


// ===== Curated exhibition traces (Phase 1) =====
// Only records with visible===true appear in controller/display modes.
// Uses existing full-canvas plant image paths (onplant/offplant).
const exhibitionTraces = [
  {
    plantId: "ex-gn3-9", cardId: "gn3-9", source: "faceToFace", color: "gn", date: "2026.05.18",
    plantImage: BASE + "offplantgn3-9.png?v=png-mobile-2",
    cardImage: BASE + "offcardgn3-9.png?v=png-mobile-2",
    questionKo: "집에서 가장 편안한 자리는 어디예요?",
    questionEn: "Where is your most comfortable spot at home?",
    traceKo: "창가 소파에 앉아 아침 햇살 받는 게 제일 편해.",
    traceEn: "Sitting on the window sofa in the morning light is the most comfortable.",
    mediaType: null, mediaSrc: null, visible: true, displayOrder: 1
  },
  {
    plantId: "ex-bl1-5", cardId: "bl1-5", source: "faceToFace", color: "bl", date: "2026.05.19",
    plantImage: BASE + "offplantbl1-5.png?v=png-mobile-2",
    cardImage: BASE + "offcardbl1-5.png?v=png-mobile-2",
    questionKo: "요즘 자주 머무는 공간이 있나요?",
    questionEn: "Is there a space you spend a lot of time in lately?",
    traceKo: "부엌 식탁. 거기서 차 마시며 하루를 시작해.",
    traceEn: "The kitchen table. I start my day there with tea.",
    mediaType: null, mediaSrc: null, visible: true, displayOrder: 2
  },
  {
    plantId: "ex-gn1-3", cardId: "gn1-3", source: "faceToFace", color: "gn", date: "2026.05.20",
    plantImage: BASE + "offplantgn1-3.png?v=png-mobile-2",
    cardImage: BASE + "offcardgn1-3.png?v=png-mobile-2",
    questionKo: "피곤할 때 어떻게 쉬는 편이에요?",
    questionEn: "How do you rest when you are tired?",
    traceKo: "말없이 누워 있는 시간이 필요해. 그냥 알아만 줘.",
    traceEn: "I need quiet time lying down. Just knowing is enough.",
    mediaType: "image", mediaSrc: BASE + "trace-photo.png?v=png-mobile-2", photo: BASE+"trace-photo.png?v=png-mobile-2", visible: true, displayOrder: 3
  },
  {
    plantId: "ex-pk2-9", cardId: "pk2-9", source: "faceToFace", color: "pk", date: "2026.05.21",
    plantImage: BASE + "offplantpk2-9.png?v=png-mobile-2",
    cardImage: BASE + "offcardpk2-9.png?v=png-mobile-2",
    questionKo: "좋아하는 맛이나 음식이 있어요?",
    questionEn: "Do you have a favorite taste or food?",
    traceKo: "보리차 한 잔이면 충분해. 자기 전에.",
    traceEn: "A cup of barley tea is enough. Before bed.",
    mediaType: "voice", mediaSrc: MEDIA_BASE + "trace-voice.mp3", voice: MEDIA_BASE+"trace-voice.mp3", visible: true, displayOrder: 4
  },
  {
    plantId: "ex-gn3-1", cardId: "gn3-1", source: "faceToFace", color: "gn", date: "2026.05.22",
    plantImage: BASE + "offplantgn3-1.png?v=png-mobile-2",
    cardImage: BASE + "offcardgn3-1.png?v=png-mobile-2",
    questionKo: "몸에서 신경 쓰이는 곳이 있나요?",
    questionEn: "Is there a part of your body you are mindful of?",
    traceKo: "",
    traceEn: "",
    mediaType: "video", mediaSrc: MEDIA_BASE + "trace-video.mp4", video: MEDIA_BASE+"trace-video.mp4", visible: true, displayOrder: 5
  },
  {
    plantId: "ex-bl3-2", cardId: "bl3-2", source: "faceToFace", color: "bl", date: "2026.05.23",
    plantImage: BASE + "offplantbl3-2.png?v=png-mobile-2",
    cardImage: BASE + "offcardbl3-2.png?v=png-mobile-2",
    questionKo: "하루 중 가장 좋아하는 시간은 언제예요?",
    questionEn: "What is your favorite time of day?",
    traceKo: "해 질 무렵. 창으로 들어오는 빛이 좋아.",
    traceEn: "Dusk. I love the light coming through the window.",
    mediaType: null, mediaSrc: null, visible: true, displayOrder: 6
  }
];

function exVisiblePlants(){
  return exhibitionTraces
    .filter(e => e.visible === true)
    .sort((a,b) => (a.displayOrder||0) - (b.displayOrder||0));
}
function exFindPlant(plantId){
  return exhibitionTraces.find(e => e.plantId === plantId && e.visible === true) || null;
}
function exQ(e, lang){ return (lang === "en") ? e.questionEn : e.questionKo; }
function exT(e, lang){ return (lang === "en") ? e.traceEn : e.traceKo; }


// ===== Phase 1 — Exhibition init functions =====
function initPublicExperience(){
  // Default behaviour — exactly like Index re 08. Nothing extra.
}

// Shared: build the black exhibition garden shell (no mode-specific wiring)
function buildExhibitionGardenShell(){
  document.body.classList.add("display-mode");        // reuse TV garden styling
  document.body.classList.add("ex-display");
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const s9 = document.getElementById("s9");
  s9.classList.add("active");
  const btn = document.querySelector("#s9 .bottom");
  if(btn) btn.style.display = "none";
  buildExhibitionGarden();
  setTimeout(fitGardenStage, 50);
  // Restore original design: logo in header + plant count
  const header = document.querySelector("#s9 .garden-header");
  if(header && !header.querySelector(".ex-logo")){
    const logo = document.createElement("img");
    logo.className = "ex-logo";
    logo.src = BASE + "cover-logo-wh.png?v=png-mobile-2";   // white logo on dark bg
    logo.alt = "JUNG ONE";
    header.insertBefore(logo, header.firstChild);
  }
  // Plant count (how many planted)
  const sub = document.getElementById("gardenSub");
  if(sub){
    const n = exVisiblePlants().length;
    sub.textContent = (CURRENT_LANG === "en")
      ? (n + " traces growing in the garden")
      : ("정원에 " + n + "개의 흔적이 자라고 있어요");
  }
  // Idle instruction overlay
  let idle = document.getElementById("exIdle");
  if(!idle){
    idle = document.createElement("div");
    idle.id = "exIdle";
    idle.className = "ex-idle";
    s9.appendChild(idle);
  }
  idle.innerHTML = '<div class="ex-idle-text"></div>';
  updateExIdleText();
  idle.style.display = "flex";
}

function initExhibitionDisplay(){
  // Display link is English-only (no toggle, no touch). DEMO/QDATA are frozen at
  // load time in the load-time language, so re-derive them (and the seeded
  // entries) in EN so every label, question and demo trace shows in English.
  CURRENT_LANG = "en";
  if(typeof QDATA_BY_LANG !== "undefined" && QDATA_BY_LANG["en"]) QDATA = QDATA_BY_LANG["en"];
  if(typeof DEMO_BY_LANG !== "undefined" && DEMO_BY_LANG["en"]){
    DEMO = DEMO_BY_LANG["en"];
    entries = [...DEMO];
  }
  // Exhibition chrome — ex-display gives the TV background + sizing; hide controls.
  document.body.classList.add("display-mode");
  document.body.classList.add("ex-display");
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const s9 = document.getElementById("s9");
  s9.classList.add("active");
  const btn = document.querySelector("#s9 .bottom");
  if(btn) btn.style.display = "none";
  // Logo in header (white logo on the dark exhibition background)
  const header = document.querySelector("#s9 .garden-header");
  if(header && !header.querySelector(".ex-logo")){
    const logo = document.createElement("img");
    logo.className = "ex-logo";
    logo.src = BASE + "cover-logo-wh.png?v=png-mobile-2";
    logo.alt = "JUNG ONE";
    header.insertBefore(logo, header.firstChild);
  }
  // Show the REAL room garden — same as the public/index-re garden: DEMO anchor +
  // live Firebase submissions, full plant layout, auto-cycling conversation bubbles,
  // on the exhibition background. Rendered SYNCHRONOUSLY (no requestAnimationFrame)
  // so it draws immediately regardless of tab focus/timing. initFirebase() →
  // startFirebaseListener() reloads entries from the room and re-renders on data.
  renderDisplayGarden();
  initFirebase();
  unlockDisplayAudio();
}

// Browsers block audio autoplay until the page receives ONE user interaction.
// A passive display can't tap, so show a one-time "tap to start" gate; a single
// click / touch / key press (e.g. at setup) unlocks sound for the whole session.
function unlockDisplayAudio(){
  if(window._audioGateBound) return;
  window._audioGateBound = true;
  const gate = document.createElement("div");
  gate.id = "audioGate";
  gate.innerHTML = '<div class="audio-gate-inner"><div class="audio-gate-play">🔊</div><div class="audio-gate-text">Click anywhere to enable sound</div></div>';
  document.body.appendChild(gate);
  function unlock(){
    try{ const a = new Audio(); a.muted = true; a.play().catch(function(){}); }catch(e){}
    window._displayAudioReady = true;
    if(gate && gate.parentNode) gate.parentNode.removeChild(gate);
    document.removeEventListener("click", unlock);
    document.removeEventListener("touchstart", unlock);
    document.removeEventListener("keydown", unlock);
  }
  document.addEventListener("click", unlock);
  document.addEventListener("touchstart", unlock);
  document.addEventListener("keydown", unlock);
}

// Synchronous render for the exhibition display (no rAF): stacks the current
// `entries` as full-canvas plant layers and starts the auto-cycling trace bubbles.
function renderDisplayGarden(){
  buildSparkles();
  const container = document.getElementById("seedsContainer");
  if(!container) return;
  fitGardenStage();
  container.innerHTML = "";
  const sub = document.getElementById("gardenSub");
  if(sub) sub.textContent = t("garden_sub_tpl", {n: Math.min(entries.length, 10)});
  const limit = 10;
  const visibleEntries = entries.length > limit ? entries.slice(-limit) : entries;
  visibleEntries.forEach((e, i) => {
    const plantSrc = plantUrlForEntry(e) || qcardSrc(e.topic, 0);
    const seed = document.createElement("div");
    seed.className = "seed-layer";
    seed.style.zIndex = String(10 + i);
    seed.innerHTML = '<img class="seed-layer-img" src="' + plantSrc + '" alt=""/>';
    seed.onclick = (ev) => showBubbleForEntry(e, false, ev);
    container.appendChild(seed);
  });
  if(bubbleTimer) clearInterval(bubbleTimer);
  bubbleIdx = 0;
  if(entries.length){
    showBubbleAuto();
    bubbleTimer = setInterval(() => { bubbleIdx = bubbleIdx + 1; showBubbleAuto(); }, 5000);
  }
}

function updateExIdleText(){
  const el = document.querySelector("#exIdle .ex-idle-text");
  if(el) el.textContent = (CURRENT_LANG === "en")
    ? "Tap a plant on the iPad\nto explore the trace it holds."
    : "아이패드에서 식물을 눌러\n남겨진 흔적을 살펴보세요.";
}

// Curated garden: full-canvas overlay of visible exhibition plants
function buildExhibitionGarden(){
  if(typeof buildSparkles === "function") buildSparkles();
  buildSparkles();
  const container = document.getElementById("seedsContainer");
  if(!container) return;
  container.innerHTML = "";
  const plants = exVisiblePlants();
  document.getElementById("gardenSub").textContent =
    t("garden_sub_tpl", {n: plants.length});
  plants.forEach((e, i) => {
    const seed = document.createElement("div");
    seed.className = "seed-layer ex-tappable";
    seed.style.zIndex = String(10 + i);
    seed.dataset.plantId = e.plantId;
    seed.innerHTML = '<img class="seed-layer-img" crossorigin="anonymous" src="' + e.plantImage + '" alt=""/>';
    container.appendChild(seed);
  });
  // Default hit-test: show trace (used by display testing). Controller overrides this.
  attachGardenHitTest(container, (plantId) => showExhibitionTrace(plantId), () => exNoTraceNotice());
}


// Notice shown when a spot with no saved trace is tapped
let exNoticeTimer = null;
function exNoTraceNotice(){}

// Alpha-based hit testing so overlapping full-canvas plants are individually clickable.

// Cache the opaque bounding box of a plant image (so thin plants are easy to tap)
const _bboxCache = {};
function getImgBBox(img){
  const src = img.src;
  if(_bboxCache[src] !== undefined) return _bboxCache[src];
  try{
    const W = 120, H = Math.round(120 * img.naturalHeight / img.naturalWidth);
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(0,0,W,H).data;
    let x0=W, y0=H, x1=0, y1=0, found=false;
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        if(data[(y*W+x)*4+3] > 8){
          found=true;
          if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y;
        }
      }
    }
    if(!found){ _bboxCache[src]=null; return null; }
    // scale back to natural pixels + pad 6%
    const sx = img.naturalWidth / W, sy = img.naturalHeight / H;
    const padX = img.naturalWidth*0.06, padY = img.naturalHeight*0.06;
    const bb = {
      x0: x0*sx - padX, x1: x1*sx + padX,
      y0: y0*sy - padY, y1: y1*sy + padY
    };
    _bboxCache[src] = bb;
    return bb;
  }catch(e){ _bboxCache[src]=null; return null; }
}

function attachGardenHitTest(container, onHit, onMiss){
  if(!container || container._hitBound) {} // allow re-bind on rebuild
  container._hitBound = true;
  container.onclick = function(ev){
    const layers = Array.from(container.querySelectorAll(".seed-layer"));
    // Test from topmost (highest z-index = last in DOM) to bottom
    for(let i = layers.length - 1; i >= 0; i--){
      const layer = layers[i];
      const img = layer.querySelector("img");
      if(!img || !img.complete || !img.naturalWidth) continue;
      const rect = img.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      if(x < 0 || y < 0 || x > rect.width || y > rect.height) continue;
      // object-fit:contain → compute the actual drawn image box inside rect
      const natRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = rect.width / rect.height;
      let drawW, drawH, offX, offY;
      if(natRatio > boxRatio){ drawW = rect.width; drawH = rect.width / natRatio; offX = 0; offY = (rect.height - drawH)/2; }
      else { drawH = rect.height; drawW = rect.height * natRatio; offY = 0; offX = (rect.width - drawW)/2; }
      const ix = x - offX, iy = y - offY;
      if(ix < 0 || iy < 0 || ix > drawW || iy > drawH) continue;
      // Map to natural pixel
      const px = Math.floor(ix / drawW * img.naturalWidth);
      const py = Math.floor(iy / drawH * img.naturalHeight);
      // Check the exact pixel plus a small neighborhood (thin plants are hard to hit)
      let hit = getImgAlpha(img, px, py) > 4;
      if(!hit){
        const R = Math.floor(img.naturalWidth * 0.025); // ~2% radius tolerance
        const h2=Math.floor(R/2); const steps = [[R,0],[-R,0],[0,R],[0,-R],[R,R],[-R,-R],[R,-R],[-R,R],[h2,0],[-h2,0],[0,h2],[0,-h2]];
        for(const [dx,dy] of steps){
          if(getImgAlpha(img, px+dx, py+dy) > 8){ hit = true; break; }
        }
      }
      if(hit){
        const pid = layer.dataset.plantId;
        if(pid && onHit) onHit(pid);
        return;
      }
    }
    // No plant matched — empty/unsaved spot
    if(onMiss) onMiss();
  };
}

// Cache tiny offscreen canvases per image to read alpha
const _alphaCanvas = {};
function getImgAlpha(img, px, py){
  try{
    const src = img.src;
    let c = _alphaCanvas[src];
    if(!c){
      // Downscale for speed; alpha map is enough at lower res
      const maxW = 270, scale = Math.min(1, maxW / img.naturalWidth);
      c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.naturalWidth * scale));
      c.height = Math.max(1, Math.round(img.naturalHeight * scale));
      c._scale = scale;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      try { ctx.drawImage(img, 0, 0, c.width, c.height); }
      catch(e){ return 255; } // cross-origin taint → treat as opaque (fallback)
      _alphaCanvas[src] = c;
    }
    const sx = Math.min(c.width-1, Math.max(0, Math.floor(px * c._scale)));
    const sy = Math.min(c.height-1, Math.max(0, Math.floor(py * c._scale)));
    const ctx = c.getContext("2d", { willReadFrequently: true });
    return ctx.getImageData(sx, sy, 1, 1).data[3];
  }catch(e){ return 255; }
}

let exTraceTimer = null;
function showExhibitionTrace(plantId){
  const e = exFindPlant(plantId);
  if(!e) return;
  if(window._curAudio){ window._curAudio.pause(); window._curAudio.currentTime = 0; window._curAudio = null; }
  exSelectedPlantId = plantId;
  const bub = document.getElementById("answerBubble");
  const inner = document.getElementById("bubbleInner");
  if(!bub || !inner) return;
  const lang = CURRENT_LANG;
  const col = (typeof TCOLORS_BY_CODE !== "undefined" && e.color && TCOLORS_BY_CODE[e.color]) ? TCOLORS_BY_CODE[e.color] : "#9aab9e";

  // DISPLAY = looks like a real saved record: category + question + date + trace
  let html = '';
  // Category label (by color)
  const catLabel = (typeof CONV_CAT !== "undefined" && e.color && CONV_CAT[e.color]) ? CONV_CAT[e.color] : "";
  if(catLabel) html += '<div class="ex-rec-cat">' + catLabel + '</div>';
  // Question
  html += '<div class="ex-rec-q">"' + exQ(e, lang) + '"</div>';
  // Date
  if(e.date) html += '<div class="ex-rec-date">' + e.date + '</div>';
  // Trace body: media first, else text
  // Show the single media this plant has (video OR image OR voice)
  if(e.video){
    html += '<video class="ex-rec-media" src="' + e.video + '" autoplay muted loop playsinline></video>';
  } else if(e.photo){
    html += '<img class="ex-rec-media" src="' + e.photo + '" alt=""/>';
  } else if(e.voice){
    // waveform + autoplay
    let bars = "";
    for(let i=0;i<32;i++){
      const h = 10 + Math.abs(Math.sin(i*0.7+1)*26 + Math.cos(i*0.4)*16);
      bars += '<rect x="'+(i*8)+'" y="'+((44-h)/2)+'" width="5" height="'+h+'" rx="2.5" fill="'+col+'" opacity="0.8"/>';
    }
    html += '<div class="ex-rec-voice"><svg width="256" height="44" viewBox="0 0 256 44">'+bars+'</svg></div>';
    const audio = new Audio(e.voice);
    audio.onended = function(){ if(window._curAudio === audio) window._curAudio = null; };
    audio.play().catch(function(){});
    window._curAudio = audio;
  }
  if(exT(e, lang)) html += '<div class="ex-rec-text">' + exT(e, lang) + '</div>';

  inner.innerHTML = html;
  inner.style.background = col + "1f";
  inner.style.borderColor = col + "55";
  // Highlight the selected plant on the garden
  document.querySelectorAll("#seedsContainer .seed-layer").forEach(s => {
    s.classList.toggle("selected", s.dataset.plantId === plantId);
  });
  bub.classList.add("show", "ex-answer-big", "ex-record");
  bub.style.left = ""; bub.style.top = "";
  const idle = document.getElementById("exIdle");
  if(idle) idle.style.display = "none";
  if(exTraceTimer) clearTimeout(exTraceTimer);
  exTraceTimer = setTimeout(() => {
    bub.classList.remove("show", "ex-answer-big", "ex-record");
    if(window._curAudio){ window._curAudio.pause(); window._curAudio = null; }
    if(idle){ idle.style.display = "flex"; }
    document.querySelectorAll("#seedsContainer .seed-layer").forEach(s => s.classList.remove("selected"));
    exSelectedPlantId = null;
  }, 25000);
}

// Temporary developer preview (replaced by iPad/Firebase in Phase 3)
window.previewExhibitionPlant = function(plantId){
  showExhibitionTrace(plantId);
};


// Phase 3 — controller-only overlay (connection indicator, reset, toast)
function injectControllerOverlay(){
  if(document.getElementById("exConn")) return;
  const conn = document.createElement("div");
  conn.id = "exConn";
  conn.className = "ex-conn wait";
  conn.innerHTML = '<span class="ex-conn-dot"></span><span class="ex-conn-text"></span>';
  document.body.appendChild(conn);

  // (reset button removed — tap the card to close)

  const toast = document.createElement("div");
  toast.id = "exToast";
  toast.className = "ex-toast";
  document.body.appendChild(toast);

  setExConn(exConnDisplayed);
}

function initExhibitionController(){
  // Controller = the SAME black garden shell, but it does NOT subscribe to Firebase
  // for showing answers. Tapping shows the QUESTION + white highlight, and WRITES
  // the selection so the TV (display) shows the answer.
  buildExhibitionGardenShell();
  document.body.classList.add("ex-controller");
  const container = document.getElementById("seedsContainer");
  document.querySelectorAll("#seedsContainer .seed-layer").forEach(seed => seed.classList.add("ex-tappable"));
  // Override the default hit-test: controller tap → question + highlight + Firebase write
  attachGardenHitTest(container, (plantId) => exControllerSelect(plantId), () => exNoTraceNotice());
  initExhibitionLink("controller");   // controller role: connection indicator only, NO answer subscription
  injectControllerOverlay();
}

// (buildControllerGarden kept for reference but no longer the entry point)
function buildControllerGarden(){
  buildExhibitionGarden();
}

function selectControllerPlant(plantId){
  exSelectedPlantId = plantId;
  // Mark selection visually
  document.querySelectorAll("#seedsContainer .seed-layer").forEach(s => {
    s.classList.toggle("selected", s.dataset.plantId === plantId);
  });
  // Phase 1: show the trace locally so it can be tested on the controller too.
  // (In Phase 3 this tap will instead tell the TV to show the trace.)
  showExhibitionTrace(plantId);
}

function exControllerReset(){
  exSelectedPlantId = null;
  document.querySelectorAll("#seedsContainer .seed-layer").forEach(s => s.classList.remove("selected"));
}

// Boot: route by exhibition mode (Phase 1)
window.addEventListener("DOMContentLoaded", () => {
  // Apply mode class to body for CSS scoping
  document.body.classList.add("mode-" + EX_MODE);

  if(EX_MODE === "display"){
    // Curated exhibition TV — no Firebase yet (Phase 1)
    initExhibitionDisplay();
  } else if(EX_MODE === "controller"){
    initExhibitionController();
  } else {
    // PUBLIC — unchanged from Index re 08
    initFirebase();
    if(IS_DISPLAY_MODE){
      enterDisplayMode();  // legacy ?display=garden still works
    }
    initPublicExperience();
  }
});


// ===== Fit the fixed 1920×1080 stage to viewport (consistent across devices) =====
function fitGardenStage(){
  const stage = document.getElementById("gardenStage");
  if(!stage) return;
  const isEx = document.body.classList.contains("ex-display");
  if(isEx){
    // Exhibition: make a 9:16 canvas COVER the whole screen (fill, crop edges),
    // keeping every plant in the same shared coordinate space (alignment intact).
    const vw = window.innerWidth, vh = window.innerHeight;
    const ar = 2160 / 3840;            // plant canvas aspect (9:16)
    let w = vw, h = vw / ar;           // fit width first
    if(h < vh){ h = vh; w = vh * ar; } // if too short, fit height (cover)
    stage.style.width = w + "px";
    stage.style.height = h + "px";
    stage.style.position = "absolute";
    stage.style.left = "50%";
    stage.style.top = "50%";
    stage.style.transform = "translate(-50%,-50%)";
    return;
  }
  // Public garden: stage fills the garden body; plants use object-fit:contain.
  stage.style.transform = "none";
  stage.style.left = "0";
  stage.style.top = "0";
  stage.style.width = "100%";
  stage.style.height = "100%";
}
window.addEventListener("resize", () => { fitGardenStage(); });
window.addEventListener("orientationchange", () => { fitGardenStage(); });

// ===== Sparkle layer (stars + fireflies) =====
let sparklesBuilt = false;
function buildSparkles(){
  if(sparklesBuilt) return;
  sparklesBuilt = true;

  // ---- Background stars (60 tiny dots) — DETERMINISTIC ----
  // Same star pattern on every device (seed-based pseudo-random)
  function srand(seed){const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x);}
  const stars = document.getElementById("starsLayer");
  if(stars){
    stars.innerHTML = "";
    for(let i = 0; i < 60; i++){
      const s = document.createElement("div");
      const r1 = srand(i + 1);
      const r2 = srand(i + 100);
      const r3 = srand(i + 200);
      const r4 = srand(i + 300);
      const r5 = srand(i + 400);
      s.className = "star" + (r1 < 0.5 ? " tiny" : (r1 > 0.88 ? " bright" : ""));
      s.style.left = (r2 * 100) + "%";
      s.style.top  = (r3 * 100) + "%";
      s.style.animationDelay = (r4 * 4) + "s";
      s.style.animationDuration = (2.5 + r5 * 3.5) + "s";
      stars.appendChild(s);
    }
  }

  // ---- Foreground fireflies (12 drifting glows) ----
  const flies = document.getElementById("firefliesLayer");
  if(flies){
    flies.innerHTML = "";
    for(let i = 0; i < 90; i++){  // lots of fireflies for exhibition
      const f = document.createElement("div");
      f.className = "firefly";
      f.style.left = (2 + srand(i + 501) * 96) + "%";
      f.style.top  = (2 + srand(i + 502) * 96) + "%";
      // Size: bias toward small. r^2 skews most values low; range ~2.5px..8px
      const rs = srand(i + 507);
      const size = 4 + (rs * rs) * 9;   // ~4-7px, some up to ~13px
      f.style.width = size.toFixed(1) + "px";
      f.style.height = size.toFixed(1) + "px";
      // Scale the glow with size
      const g1 = (size * 1.8).toFixed(0), g2 = (size * 3.4).toFixed(0), g3 = (size * 5.6).toFixed(0);
      f.style.boxShadow =
        "0 0 " + g1 + "px rgba(255,240,160,1),"
        + "0 0 " + g2 + "px rgba(255,230,130,0.8),"
        + "0 0 " + g3 + "px rgba(255,215,110,0.5)";
      f.style.animationDelay = (srand(i + 503) * 8) + "s, " + (srand(i + 504) * 6) + "s";
      const drift = 48 + srand(i + 505) * 34;   // 48s–82s (slower drift)
      const glow  = 2.5 + srand(i + 506) * 3;    // 2.5s–5.5s (livelier blink)
      f.style.animationDuration = drift + "s, " + glow + "s";
      flies.appendChild(f);
    }
  }
}

// ===== S9 — Garden (live design, no name labels) =====
let bubbleTimer = null;
let bubbleIdx = 0;

function buildGarden(){
  buildSparkles();
  const container = document.getElementById("seedsContainer");
  container.innerHTML = "";
  document.getElementById("gardenSub").textContent = t("garden_sub_tpl", {n: Math.min(entries.length, 10)});

  requestAnimationFrame(() => {
    fitGardenStage();

    // Show up to 10 plants — newest entries take priority
    const limit = 10;
    const visibleEntries = entries.length > limit ? entries.slice(-limit) : entries;

    // FULL-CANVAS overlay rendering:
    // Each plant PNG is a 2160×3840 transparent image with the plant already
    // in its final position. So we simply stack every plant as a full-bleed
    // layer (inset:0). No coordinates, sizes, rotations or manual positions.
    visibleEntries.forEach((e, i) => {
      const plantSrc = plantUrlForEntry(e) || qcardSrc(e.topic, 0);
      const seed = document.createElement("div");
      seed.className = "seed-layer";
      // zIndex follows planting order (only adjust later if overlap looks wrong)
      seed.style.zIndex = String(10 + i);

      if(e._key && !seenKeys.has(e._key)){
        seed.classList.add("new-arrival");
        seenKeys.add(e._key);
      }
      seed.innerHTML = '<img class="seed-layer-img" src="' + plantSrc + '" alt=""/>';
      // Clicking a plant layer opens its trace bubble
      seed.onclick = (ev) => showBubbleForEntry(e, false, ev);
      container.appendChild(seed);
    });

    if(bubbleTimer) clearInterval(bubbleTimer);
    bubbleIdx = 0;
    if(entries.length){
      showBubbleAuto();
      const cycle = IS_DISPLAY_MODE ? 4000 : 5000;
      bubbleTimer = setInterval(() => {
        bubbleIdx = bubbleIdx + 1;
        showBubbleAuto();
      }, cycle);
    }
  });
}

// Organic clustering — NOT a grid.
// Bg plants near edges (partly off-screen OK).
// Trace plants closer to center (vine intersection area).
// Mid plants in between.
function getPositions(n, W, H){
  const positions = [];
  // Deterministic pseudo-random per index (stable across reloads)
  function r(seed){ const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }

  // Approx plant footprint (px) by layer — used for overlap testing
  const layerSize = { 0: Math.min(W,H)*0.22, 1: Math.min(W,H)*0.19, 2: Math.min(W,H)*0.16 };
  const PAD = 0.10;  // keep within 10%..90% of canvas

  for(let i = 0; i < n; i++){
    // Assign layer in a stable pattern
    const mod = i % 7;
    let layer;
    if(mod === 0 || mod === 5) layer = 0;
    else if(mod === 2 || mod === 3 || mod === 6) layer = 1;
    else layer = 2;

    const size = layerSize[layer];
    let best = null, bestDist = -1;

    // Try several candidate spots; pick the one furthest from existing plants
    // (maximizes spacing → minimizes overlap, but allows mild overlap when crowded)
    const tries = 14;
    for(let t = 0; t < tries; t++){
      const cx = W * (PAD + (1 - 2*PAD) * r(i*53 + t*7 + 11));
      const cy = H * (PAD + (1 - 2*PAD) * r(i*97 + t*13 + 29));
      let minDist = Infinity;
      for(const p of positions){
        const dx = p.x - cx, dy = p.y - cy;
        const d = Math.sqrt(dx*dx + dy*dy);
        // Normalize by combined sizes so big plants need more space
        const need = (size + (layerSize[p.layer]||size)) * 0.5;
        const ratio = d / need;
        if(ratio < minDist) minDist = ratio;
      }
      if(minDist > bestDist){ bestDist = minDist; best = {x: cx, y: cy}; }
      // Good enough spacing (centers ≥ ~0.62 of combined half-size apart → <~50% overlap)
      if(minDist >= 0.62) break;
    }

    let x = best ? best.x : W*0.5;
    let y = best ? best.y : H*0.5;
    // Clamp so plant stays mostly inside
    const half = size * 0.5;
    x = Math.max(half*0.4, Math.min(W - half*0.4, x));
    y = Math.max(half*0.4, Math.min(H - half*0.4, y));

    // Per-plant gentle variation
    const rot = (r(i + 1200) - 0.5) * 22;
    const scale = 0.92 + r(i + 1300) * 0.24;
    const opacity = 0.85 + r(i + 1400) * 0.15;
    positions.push({x, y, layer, rot, scale, opacity, size});
  }
  return positions;
}

let _lastAutoEntry = null;
function showBubbleAuto(){
  // Only cycle entries that actually have a trace (media or text)
  const withTrace = entries.filter(e => !!(e.video || e.photo || e.voice || (e.answer && e.answer.trim())));
  if(!withTrace.length) return;
  let e;
  if(IS_DISPLAY_MODE || document.body.classList.contains("ex-display")){
    // Passive display → random order (avoid repeating the same trace twice in a row)
    if(withTrace.length === 1){
      e = withTrace[0];
    } else {
      do { e = withTrace[Math.floor(Math.random() * withTrace.length)]; }
      while(e === _lastAutoEntry);
    }
    _lastAutoEntry = e;
  } else {
    e = withTrace[bubbleIdx % withTrace.length];
  }
  showBubbleForEntry(e, true);
}

// Show bubble for a given entry. Position is centered near the bottom of the
// garden (plants are full-canvas, so there is no single seed coordinate).
function showBubbleForEntry(e, isAuto, ev){
  const body = document.getElementById("gardenBody");
  const rect = body.getBoundingClientRect();
  let x, y;
  if(ev && typeof ev.clientX === "number"){
    // Direct click → open the trace right where the plant was tapped
    x = ev.clientX - rect.left;
    y = ev.clientY - rect.top;
  } else {
    // (Passive display auto-cycle is randomly positioned inside showBubbleAt.)
    // Auto-cycle → use the matching plant layer's center (so it appears at that plant)
    let px = body.clientWidth/2, py = body.clientHeight*0.3;
    try{
      const layers = document.querySelectorAll("#seedsContainer .seed-layer");
      // find layer index matching this entry in the visible set
      const limit = 10;
      const visibleEntries = entries.length > limit ? entries.slice(-limit) : entries;
      const idx = visibleEntries.indexOf(e);
      if(idx >= 0 && layers[idx]){
        const r = layers[idx].getBoundingClientRect();
        px = r.left - rect.left + r.width/2;
        py = r.top - rect.top + r.height*0.35;
      }
    }catch(err){}
    x = px; y = py;
  }
  showBubbleAt(e, x, y, !!isAuto);
}

function showBubbleAt(e, x, y, isAuto){
  // Stop any previously playing audio (always — switching plants stops sound)
  if(window._curAudio){
    window._curAudio.pause();
    window._curAudio.currentTime = 0;
    window._curAudio = null;
  }
  const bub = document.getElementById("answerBubble");
  // No saved trace (no media, no text) → never pop an empty bubble. Just close any open one.
  if(!(e.video || e.photo || e.voice || (e.answer && e.answer.trim()))){
    if(bub) bub.classList.remove("show");
    return;
  }
  const col = e.color || "#9aab9e";
  const inner = document.getElementById("bubbleInner");
  inner.style.background = col + "22";
  inner.style.borderColor = col + "44";

  // Build header: Question + Date (NO name)
  let qText = "";
  if(e.questionText){
    qText = e.questionText;
  } else if(e.q && e.q.includes('-')){
    const idx = parseInt(e.q.split('-')[1])-1;
    const obj = QDATA[e.topic] ? QDATA[e.topic][idx] : null;
    qText = obj ? obj.q : "";
  } else if(e.source === "faceToFace"){
    // Face-to-face entries have no online question — show the category instead
    const color = TOPIC_COLOR[e.topic];
    qText = (typeof CONV_CAT !== "undefined" && CONV_CAT[color]) ? CONV_CAT[color] : "";
  }
  const dateStr = e.date || "";
  let headerHtml = "";
  if(qText) headerHtml += '<div class="b-question">"' + qText + '"</div>';
  if(dateStr) headerHtml += '<div class="b-date">' + dateStr + '</div>';

  // Body — show the saved trace (entries with no trace are filtered out above)
  let bodyHtml = "";
  if(e.video){
    bodyHtml = '<video src="'+e.video+'" style="width:100%;aspect-ratio:16/9;border-radius:6px;display:block;margin-top:8px;" autoplay muted loop playsinline></video>';
  } else if(e.photo){
    bodyHtml = '<img src="'+e.photo+'" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px;display:block;margin-top:8px;"/>';
  } else if(e.voice){
    let bars = "";
    for(let i=0;i<28;i++){
      const h = 8 + Math.abs(Math.sin(i*0.7+1)*20 + Math.cos(i*0.4)*14);
      bars += '<rect x="'+(i*6)+'" y="'+((30-h)/2)+'" width="4" height="'+h+'" rx="2" fill="'+col+'" opacity="0.75"/>';
    }
    const label = isAuto ? t("bubble_voicetrace") : t("bubble_playing");
    bodyHtml = '<div style="margin-top:8px;"><svg width="168" height="30" viewBox="0 0 168 30">'+bars+'</svg><div style="font-family:monospace;font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:'+col+';opacity:.6;margin-top:3px;">'+label+'</div></div>';
    // Play on direct click, AND during the auto-cycle on a passive display
    // (so the touchless TV plays voice traces too). Browsers block autoplay
    // until the page has had one interaction — unlockDisplayAudio() handles that.
    const isDisplay = (IS_DISPLAY_MODE || document.body.classList.contains("ex-display"));
    if(!isAuto || isDisplay){
      const audio = new Audio(e.voice);
      audio.onended = function(){
        if(window._curAudio === audio){ window._curAudio = null; }
      };
      audio.play().catch(function(){});
      window._curAudio = audio;
    }
  } else if(e.answer && e.answer.trim()){
    bodyHtml = '<div class="b-answer">' + e.answer + '</div>';
  }

  inner.innerHTML = headerHtml + bodyHtml;

  // Measure the actual rendered size so the bubble stays fully on-screen at any
  // size (phone OR enlarged 4K display bubble) and any position.
  const gb = document.getElementById("gardenBody");
  const gbW = gb.clientWidth, gbH = gb.clientHeight;
  const r = bub.getBoundingClientRect();
  const bw = Math.min(r.width  || 240, gbW - 20);
  const bh = Math.min(r.height || 120, gbH - 20);
  let lx, ty;
  if(isAuto && (IS_DISPLAY_MODE || document.body.classList.contains("ex-display"))){
    // Passive display auto-cycle → place anywhere in the FULL free area (measured
    // AFTER sizing the bubble, so a big bubble still scatters instead of clamping
    // back to the centre).
    lx = 10 + Math.random() * Math.max(0, gbW - bw - 20);
    ty = 10 + Math.random() * Math.max(0, gbH - bh - 20);
  } else {
    lx = Math.max(10, Math.min(x - bw/2, gbW - bw - 10));
    ty = Math.max(10, Math.min(y - 20,   gbH - bh - 10));
  }
  bub.style.left = lx + "px";
  bub.style.top  = ty + "px";
  bub.classList.add("show");
}



// ===== Reset =====
function resetAndGo(){
  if(bubbleTimer) clearInterval(bubbleTimer);
  if(window._curAudio){window._curAudio.pause();window._curAudio=null;}
  S = {topic:null, question:null, questionIdx:null, qChoices:[], qChoicesByTopic:{}, listenCard:null, invitationLink:null, uploadedFile:null};
  go("s1");
}

// ===== 4. Reliable image decoding on mobile =====
(function(){
  // Viewport bucket → pixel budget for decoded card images
  function bucket(){
    const w = Math.min(window.innerWidth, window.innerHeight);
    if (w <= 380) return "s";     // small phones
    if (w <= 480) return "m";     // typical phones
    if (w <= 834) return "l";     // tablets
    return "xl";                  // desktop / TV
  }
  const SIZES = { s: 160, m: 220, l: 300, xl: 420 };

  function tuneImg(img){
    if(!img || img.dataset.tuned) return;
    img.dataset.tuned = "1";
    img.loading = "eager";
    img.decoding = "async";
    // Hint intrinsic size so the browser can rasterize at a sensible scale
    const px = SIZES[bucket()];
    // For card/plant images we don't need full-res decode; sizes attr helps if srcset added later
    if(!img.getAttribute("sizes")) img.setAttribute("sizes", px + "px");
  }

  // Run on any imgs already present + observe future ones (cards built dynamically)
  function tuneAll(){
    document.querySelectorAll(".topic-card img, .qcard img, .conv-listen-card img, .conv-card img, .icp-bg img, .seed-img img").forEach(tuneImg);
  }
  if(document.readyState !== "loading") tuneAll();
  else document.addEventListener("DOMContentLoaded", tuneAll);

  // MutationObserver to tune cards rendered later
  const mo = new MutationObserver(muts => {
    for(const m of muts){
      for(const node of m.addedNodes){
        if(node.nodeType === 1){
          if(node.tagName === "IMG") tuneImg(node);
          node.querySelectorAll && node.querySelectorAll("img").forEach(tuneImg);
        }
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

