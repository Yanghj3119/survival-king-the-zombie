// 동료 소개 이미지 · 대사 · 서사

export const COMPANION_INTRO_IMAGES = {
  grandmother: './media/grandmother.jpg',
  granddaughter: './media/granddaughter.jpg',
  police: './media/police.jpg',
  pharmacist: './media/pharmacist.jpg',
  military_dog: './media/military-dog.jpg',
  stray_cat: './media/stray-cat.jpg',
  chef: './media/chef.jpg',
  engineer: './media/engineer.jpg',
  nurse: './media/nurse.jpg',
  soldier: './media/soldier.jpg',
  vaccine_developer: './media/vaccine-developer.jpg',
  jisoo: './media/jisoo.jpg',
};

export const COMPANION_QUOTES = {
  police: '아직, 끝난 게 아닙니다. 제가 지킬게요.',
  pharmacist: '약은 사람을 살리기 위해 존재하는 겁니다.',
  military_dog: '주인… 안전하게. 제가 지킬게요.',
  stray_cat: '조금만 더… 좋은 곳으로 가자.',
  chef: '맛있는 거 먹고, 살아야지.',
  engineer: '고장 난 건, 고칠 수 있습니다.',
  nurse: '사람을 살리는 게 제 일이니까요.',
  jisoo: '끝까지 사람을 살리는 게 제 일입니다. 함께 가요.',
  grandmother: '다시 만나게 해줘서 고맙습니다. 함께 살아남읍시다.',
  granddaughter: '할머니를 만나게 해줘서 고마워요. 이제 함께할게요.',
  soldier: '다시 싸울 수 있습니다. 지금은 살아남아야죠.',
  vaccine_developer: '이게 마지막 기회일지도 모릅니다.'
};

export const COMPANION_STORIES = {
  police: { past: '무너진 질서 속에서도 시민을 지키려 했던 전직 경찰관. 마지막 신고를 끝내지 못한 죄책감이 남아 있다.', quest: '마지막 신고', place: 'police_station', placeName: '경찰서', flag: 'quest_police_done', objective: '경찰서 무전실에서 미처 전달하지 못한 구조 요청 기록을 찾는다.' },
  pharmacist: { past: '약을 구하지 못해 환자를 잃은 경험 때문에, 누구에게 약을 먼저 써야 할지 늘 고민한다.', quest: '남겨진 처방전', place: 'hospital', placeName: '병원', flag: 'quest_pharmacist_done', objective: '병원 약제실에서 환자 명단과 처방 기록을 확인한다.' },
  military_dog: { past: '명령을 기다리도록 훈련받았지만, 이제는 자신이 믿을 사람을 스스로 선택해야 한다.', quest: '마지막 핸들러', place: 'military', placeName: '군부대', flag: 'quest_dog_done', objective: '군부대에서 이전 핸들러의 흔적을 찾아 제로가 안심할 시간을 준다.' },
  stray_cat: { past: '폐허가 된 골목에서 혼자 살아남았다. 쉽게 다가오지 않지만 위험을 먼저 알아차린다.', quest: '숨겨진 은신처', place: 'school', placeName: '학교', flag: 'quest_cat_done', objective: '학교 창고에서 고양이가 기억하는 안전한 은신처를 확인한다.' },
  chef: { past: '대피소에서 수많은 사람을 먹였지만, 마지막 식량을 누구에게 줄지 결정해야 했던 기억을 품고 있다.', quest: '마지막 식탁', place: 'mart', placeName: '마트', flag: 'quest_chef_done', objective: '마트에서 함께 나눌 식량을 찾아 공평한 배급을 증명한다.' },
  engineer: { past: '고장 난 장비를 고쳐 사람들을 살렸지만, 자신이 만든 발전기가 대피소의 위치를 노출했다는 죄책감이 있다.', quest: '꺼진 발전기', place: 'broadcasting', placeName: '방송국', flag: 'quest_engineer_done', objective: '방송국의 비상 발전기 기록을 조사하고 위험을 감수할지 결정한다.' },
  nurse: { past: '환자를 살리는 일과 모두를 살리는 일 사이에서 선택해야 했던 간호사. 그때의 결정을 아직 용서하지 못했다.', quest: '병실의 이름들', place: 'hospital', placeName: '병원', flag: 'quest_nurse_done', objective: '병실 기록을 찾아 희생된 환자들의 이름을 남긴다.' },
  jisoo: { past: '감염 사태 속에서도 부상자를 돌보던 119 구급대원. 마지막 구조 교신과 동료 대원들의 행방을 마음에 품고 있다.', quest: '마지막 구조 교신', place: 'fire_station', placeName: '소방서', flag: 'quest_jisoo_sd_resolved', objective: '소방서 차고의 구급차에서 블랙박스 SD카드를 회수한 뒤, 윤지수와 함께 단말기에서 음성 기록을 해독한다.' },
  soldier: { past: '후퇴 명령을 전달했던 행정보급관. 철수 과정에서 보급과 인원 확인을 책임졌지만, 끝내 돌아오지 못한 부하들의 명단을 마음에 품고 있다.', quest: '후퇴 명령', place: 'military', placeName: '군부대', flag: 'quest_soldier_done', objective: '부대 통신 기록에서 당시 후퇴 명령의 진실을 확인한다.' },
  vaccine_developer: { past: '백신 연구를 위해 중요한 사람들을 위험에 노출했다. 연구 성과보다 그 선택의 책임을 먼저 마주해야 한다.', quest: '실험 기록', place: 'laboratory', placeName: '연구소', flag: 'quest_vaccine_done', objective: '연구소에서 실험 기록을 회수하고 공개 여부를 결정한다.' },
  grandmother: { past: '손녀가 돌아올까 봐 아파트를 떠나지 못한 할머니. 손녀를 지키지 못할지 모른다는 두려움에 매일 놀이터 쪽을 바라본다.', quest: '기다림의 끝', place: 'apartment', placeName: '아파트', flag: 'quest_family_reunion_done', objective: '놀이터에 있는 손녀와 재회한다.' },
  granddaughter: { past: '부모님의 생사를 알 수 없는 상황에서 부모를 찾기 위해 집에서 나온 아이. 위험한 세상 속에서도 가족을 다시 만나려는 마음을 놓지 못한다.', quest: '할머니를 기다리며', place: 'playground', placeName: '놀이터', flag: 'quest_family_reunion_done', objective: '아파트에 있는 할머니와 재회한다.' }
};
