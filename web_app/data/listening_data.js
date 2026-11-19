/**
 * JPD326 Listening Comprehension & Cloze Data (Luyện Nghe & Đục Lỗ Kéo Thả)
 * Format token đục lỗ trong `cloze`: {{từ_đúng|cách_đọc_hiragana|nghĩa_tiếng_việt|mức_độ}}
 *   - mức_độ = 1: Từ vựng/cấu trúc trọng tâm (chế độ Trọng tâm & Đầy đủ)
 *   - mức_độ = 2: Từ mở rộng (chế độ Đầy đủ)
 */

window.LISTENING_DATA = [
  {
    id: 'listen_6_1',
    lesson: '第 6 課',
    code: 'Bài 6 - Nghe 1',
    title: 'Nhà cửa ở Hokkaido & Tuyết mùa đông',
    jp_title: '北海道の家と雪',
    audio: 'audio/listening/bai_6_1.mp3',
    duration_label: '00:46',
    type: 'monologue',
    summary: 'Tìm hiểu đặc điểm thiết kế mái nhà tại vùng tuyết rơi dày Hokkaido để chịu được sức nặng của tuyết.',
    lines: [
      {
        start: 0.0,
        end: 7.5,
        cloze: '{{北海道|ほっかいどう|Hokkaido|1}}では、11月の初め頃から{{雪|ゆき|tuyết|2}}が{{降り始め|ふりはじめ|bắt đầu rơi|1}}、数メートルも{{積もる|つもる|tích tụ, chất đống|1}}ところがあります。',
        vi: 'Ở Hokkaido, từ khoảng đầu tháng 11 tuyết bắt đầu rơi, có những nơi tuyết chất dày đến vài mét.'
      },
      {
        start: 8.0,
        end: 16.0,
        cloze: '雪は積もると大変{{重い|おもい|nặng|2}}ため、北海道の家の{{屋根|やね|mái nhà|1}}は雪のことを{{考えて|かんがえて|suy nghĩ, tính đến|2}}{{作られて|つくられて|được làm / thiết kế|1}}います。',
        vi: 'Vì tuyết khi tích tụ lại sẽ vô cùng nặng, nên mái nhà ở Hokkaido được thiết kế có tính đến chuyện tuyết rơi.'
      },
      {
        start: 16.8,
        end: 20.8,
        cloze: '屋根は{{金属|きんぞく|kim loại|1}}でできていて、{{瓦|かわら|ngói|1}}はありません。',
        vi: 'Mái nhà được làm bằng kim loại và không có ngói.'
      },
      {
        start: 21.2,
        end: 25.2,
        cloze: '雪の{{重み|おもみ|sức nặng|2}}で瓦が{{割れて|われて|bị vỡ|1}}しまうからです。',
        vi: 'Bởi vì sức nặng của tuyết sẽ làm ngói bị vỡ.'
      },
      {
        start: 25.8,
        end: 30.8,
        cloze: '雪が{{滑り落ちる|すべりおちる|trượt rơi xuống|1}}ように、屋根の{{傾斜|けいしゃ|độ nghiêng, độ dốc|1}}を{{急に|きゅうに|dốc đứng|2}}してあります。',
        vi: 'Để tuyết trượt rơi xuống, độ dốc của mái nhà được làm dốc đứng.'
      },
      {
        start: 31.2,
        end: 42.5,
        cloze: 'しかし、最近では積もった雪を{{落とさず|おとさず|không làm rơi xuống|2}}、屋根の上で{{溶かす|とかす|làm tan chảy|1}}{{工夫|くふう|biện pháp, sáng kiến|1}}をしているので、屋根が{{平らに|たいらに|bằng phẳng|1}}なっている家もあります。',
        vi: 'Tuy nhiên, gần đây người ta áp dụng biện pháp làm tan tuyết ngay trên mái mà không cần làm rơi tuyết đã tích tụ xuống, nên cũng có những ngôi nhà có mái bằng phẳng.'
      }
    ],
    vocab: [
      { word: '積もる', kana: 'つもる', meaning: 'chất đống, tích tụ (tuyết)' },
      { word: '屋根', kana: 'やね', meaning: 'mái nhà' },
      { word: '金属', kana: 'きんぞく', meaning: 'kim loại' },
      { word: '瓦', kana: 'かわら', meaning: 'ngói' },
      { word: '滑り落ちる', kana: 'すべりおちる', meaning: 'trượt rơi xuống' },
      { word: '傾斜', kana: 'けいしゃ', meaning: 'độ dốc, độ nghiêng' },
      { word: '溶かす', kana: 'とかす', meaning: 'làm tan chảy' },
      { word: '平ら', kana: 'たいら', meaning: 'bằng phẳng' }
    ]
  },
  {
    id: 'listen_6_2',
    lesson: '第 6 課',
    code: 'Bài 6 - Nghe 2',
    title: 'Kiến trúc nhà ở Okinawa & Cách chống bão',
    jp_title: '沖縄の建物と台風',
    audio: 'audio/listening/bai_6_2.mp3',
    duration_label: '00:46',
    type: 'monologue',
    summary: 'Khám phá kiến trúc nhà truyền thống tại Okinawa để chống nắng nóng mùa hè và những cơn bão lớn.',
    lines: [
      {
        start: 0.0,
        end: 3.5,
        cloze: '沖縄の{{建物|たてもの|tòa nhà, kiến trúc|2}}について{{ご説明|ごせつめい|giải thích|2}}します。',
        vi: 'Tôi xin giải thích về kiến trúc nhà cửa ở Okinawa.'
      },
      {
        start: 3.6,
        end: 11.4,
        cloze: '沖縄の夏は{{日差し|ひざし|ánh nắng|1}}が強くてとても{{暑い|あつい|nóng|2}}ですから、写真のように{{軒|のき|mái hiên|1}}を{{長く|ながく|dài|1}}してあります。',
        vi: 'Mùa hè ở Okinawa ánh nắng gay gắt và rất nóng, nên mái hiên được làm dài ra như trong ảnh.'
      },
      {
        start: 11.8,
        end: 15.3,
        cloze: 'また、沖縄は{{台風|たいふう|bão|1}}が多い{{地域|ちいき|khu vực, vùng|1}}です。',
        vi: 'Ngoài ra, Okinawa là khu vực có nhiều bão.'
      },
      {
        start: 15.5,
        end: 24.3,
        cloze: 'そのため、{{伝統的な|でんとうてきな|mang tính truyền thống|1}}沖縄の家では、台風に{{備えて|そなえて|đề phòng, chuẩn bị|1}}家の周りを{{石の塀|いしのへい|tường đá|1}}で{{囲んで|かこんで|bao quanh|1}}あります。',
        vi: 'Vì vậy, ở những ngôi nhà truyền thống của Okinawa, để đề phòng bão, xung quanh nhà được bao bọc bởi tường đá.'
      },
      {
        start: 24.8,
        end: 33.8,
        cloze: '屋根の{{瓦|かわら|ngói|2}}は強い風で{{飛ばない|とばない|không bị thổi bay|1}}ように、{{漆喰|しっくい|vữa Shikkui|2}}と呼ばれる白い{{セメント|せめんと|xi măng|1}}のようなもので{{固めて|かためて|cố định, làm cứng|1}}あります。',
        vi: 'Ngói trên mái nhà được cố định chắc bằng một chất giống như xi măng trắng gọi là vữa Shikkui để không bị gió mạnh thổi bay.'
      },
      {
        start: 34.2,
        end: 42.5,
        cloze: 'しかし、最近では伝統的な家に{{代わって|かわって|thay cho|1}}、{{鉄筋コンクリート|てっきんこんくりーと|bê tông cốt thép|1}}でできた家が{{ほとんど|hầu hết|2}}です。',
        vi: 'Tuy nhiên, gần đây thay cho những ngôi nhà truyền thống, hầu hết các ngôi nhà đều được xây bằng bê tông cốt thép.'
      }
    ],
    vocab: [
      { word: '日差し', kana: 'ひざし', meaning: 'ánh nắng mặt trời' },
      { word: '軒', kana: 'のき', meaning: 'mái hiên' },
      { word: '備える', kana: 'そなえる', meaning: 'đề phòng, chuẩn bị sẵn' },
      { word: '石の塀', kana: 'いしのへい', meaning: 'tường đá' },
      { word: '囲む', kana: 'かこむ', meaning: 'bao quanh, vây quanh' },
      { word: '漆喰', kana: 'しっくい', meaning: 'vữa Shikkui truyền thống' },
      { word: '固める', kana: 'かためる', meaning: 'làm cứng, cố định chắc' },
      { word: '鉄筋コンクリート', kana: 'てっきんコンクリート', meaning: 'bê tông cốt thép' }
    ]
  },
  {
    id: 'listen_6_3',
    lesson: '第 6 課',
    code: 'Bài 6 - Nghe 3',
    title: 'Hội thoại: Mệt mỏi mùa hè (夏バテ) & Món lươn Unagi',
    jp_title: '夏バテとうなぎ',
    audio: 'audio/listening/bai_6_3.mp3',
    duration_label: '00:53',
    type: 'dialogue',
    summary: 'Cuộc trò chuyện hỏi thăm sức khỏe bạn Mary khi bị chán ăn do nắng nóng mùa hè và lời khuyên về món ăn bổ dưỡng.',
    lines: [
      {
        start: 4.0,
        end: 8.2,
        speaker: '友人',
        cloze: 'メアリーさん、どうしたの？{{元気|げんき|khỏe mạnh, tươi tỉnh|1}}ないね。',
        vi: 'Mary ơi, sao thế? Trông cậu không được khỏe nhỉ.'
      },
      {
        start: 8.4,
        end: 12.6,
        speaker: 'メアリー',
        cloze: 'うーん、なんだか最近、体の{{調子|ちょうし|tình trạng (cơ thể)|1}}が{{悪くて|わるくて|xấu, không khỏe|2}}…。',
        vi: 'Ừm, chẳng hiểu sao dạo này trong người tớ cứ thấy không khỏe...'
      },
      {
        start: 12.7,
        end: 14.5,
        speaker: '友人',
        cloze: 'えっ、{{大丈夫|だいじょうぶ|ổn, không sao|2}}？',
        vi: 'Ủa, cậu có sao không?'
      },
      {
        start: 14.6,
        end: 18.2,
        speaker: 'メアリー',
        cloze: 'うーん、それに{{食欲|しょくよく|cảm giác thèm ăn|1}}もなくて…。',
        vi: 'Ừm, thêm nữa là tớ cũng chẳng có cảm giác thèm ăn...'
      },
      {
        start: 18.3,
        end: 20.8,
        speaker: '友人',
        cloze: '{{冷たい|つめたい|lạnh|1}}ものばかり{{飲んでいる|のんでいる|đang uống|2}}んじゃない？',
        vi: 'Chẳng phải là cậu toàn uống đồ lạnh suốt hay sao?'
      },
      {
        start: 21.0,
        end: 23.4,
        speaker: 'メアリー',
        cloze: 'うん、{{暑い|あつい|nóng|2}}から。',
        vi: 'Ừ, tại trời nóng mà.'
      },
      {
        start: 23.5,
        end: 32.8,
        speaker: '友人',
        cloze: 'それじゃあ、{{体調を崩す|たいちょうをくずす|suy sụp sức khỏe, đổ bệnh|1}}よ。きっと{{夏バテ|なつばて|mệt mỏi do nắng nóng mùa hè|1}}だね。暑い時こそ、{{スープ|すーぷ|súp|2}}のような{{温かい|あたたかい|ấm nóng|1}}ものが体にいいんだよ。',
        vi: 'Thế thì sẽ bị suy nhược cơ thể đấy. Chắc chắn là mệt mỏi do nắng nóng mùa hè (Natsubate) rồi. Chính những lúc trời nóng thì đồ ấm nóng như súp mới tốt cho cơ thể đấy.'
      },
      {
        start: 33.0,
        end: 35.2,
        speaker: 'メアリー',
        cloze: '温かいものね。',
        vi: 'Đồ ấm nóng nhỉ.'
      },
      {
        start: 35.3,
        end: 47.0,
        speaker: '友人',
        cloze: 'そう。それに、日本では夏の食べ物として{{うなぎ|うなぎ|lươn|1}}をよく食べるよ。うなぎは{{栄養|えいよう|dinh dưỡng|1}}があるからね。「夏はうなぎに{{限る|かぎる|là nhất, không gì bằng|1}}」って{{言われてる|いわれてる|được nói là|2}}んだよ。',
        vi: 'Đúng rồi. Thêm nữa, ở Nhật người ta hay ăn lươn (Unagi) như món ăn mùa hè đấy. Vì lươn rất giàu dinh dưỡng mà. Người ta vẫn thường nói "Mùa hè thì nhất định phải là món lươn" đấy.'
      },
      {
        start: 47.2,
        end: 49.5,
        speaker: 'メアリー',
        cloze: 'へえー。',
        vi: 'Ồ, ra vậy.'
      }
    ],
    vocab: [
      { word: '食欲', kana: 'しょくよく', meaning: 'cảm giác thèm ăn' },
      { word: '体調を崩す', kana: 'たいちょうをくずす', meaning: 'suy sụp sức khỏe, đổ bệnh' },
      { word: '夏バテ', kana: 'なつバテ', meaning: 'mệt mỏi / suy nhược vì nắng nóng mùa hè' },
      { word: '温かい', kana: 'あたたかい', meaning: 'ấm nóng' },
      { word: 'うなぎ', kana: 'うなぎ', meaning: 'lươn' },
      { word: '栄養', kana: 'えいよう', meaning: 'dinh dưỡng' },
      { word: '〜に限る', kana: '〜にかぎる', meaning: 'là nhất, không gì bằng ~' }
    ]
  },
  {
    id: 'listen_6_4',
    lesson: '第 6 課',
    code: 'Bài 6 - Nghe 4',
    title: 'Gió khô Karakkaze tại Maebashi, tỉnh Gunma',
    jp_title: '群馬県前橋の空っ風',
    audio: 'audio/listening/bai_6_4.mp3',
    duration_label: '00:57',
    type: 'monologue',
    summary: 'Giới thiệu về hiện tượng gió khô mùa đông Karakkaze nổi tiếng ở tỉnh Gunma, điện gió và lễ hội thả diều khổng lồ.',
    lines: [
      {
        start: 0.0,
        end: 4.3,
        cloze: '私の{{故郷|ふるさと|quê hương|1}}は群馬県の前橋というところです。',
        vi: 'Quê hương của tôi là một nơi tên là Maebashi thuộc tỉnh Gunma.'
      },
      {
        start: 4.5,
        end: 9.8,
        cloze: '群馬県といえば、「{{空っ風|からっかぜ|gió khô mùa đông Karakkaze|1}}」と呼ばれる{{強い風|つよいかぜ|gió mạnh|2}}が有名です。',
        vi: 'Nhắc đến tỉnh Gunma thì nổi tiếng với ngọn gió mạnh được gọi là "Karakkaze" (gió khô mùa đông).'
      },
      {
        start: 10.5,
        end: 18.0,
        cloze: '{{北西|ほくせい|hướng Tây Bắc|1}}から吹いてきた{{湿った|しめった|ẩm ướt|1}}風が山に{{ぶつかり|ぶつかり|đập vào, va vào|1}}、日本海側に{{雪を降らせます|ゆきをふらせます|làm tuyết rơi|2}}。',
        vi: 'Gió ẩm thổi từ hướng Tây Bắc đập vào núi, làm tuyết rơi ở phía biển Nhật Bản.'
      },
      {
        start: 18.5,
        end: 24.8,
        cloze: 'それによって{{乾いた|かわいた|khô ráo|1}}風は高い山を{{越えます|こえます|vượt qua|1}}。これが空っ風です。',
        vi: 'Nhờ đó, ngọn gió đã trở nên khô ráo vượt qua những ngọn núi cao. Đây chính là gió Karakkaze.'
      },
      {
        start: 25.2,
        end: 29.8,
        cloze: 'この風は強くて、{{自転車|じてんしゃ|xe đạp|2}}に乗るのも{{大変|たいへん|vất vả|2}}です。',
        vi: 'Ngọn gió này mạnh đến mức việc đi xe đạp cũng rất vất vả.'
      },
      {
        start: 30.2,
        end: 34.2,
        cloze: '夜、風の音で{{眠れない|ねむれない|không ngủ được|1}}こともあります。',
        vi: 'Ban đêm, cũng có khi không thể ngủ được vì tiếng gió rít.'
      },
      {
        start: 34.8,
        end: 40.0,
        cloze: 'この強い{{北風|きたかぜ|gió Bắc|2}}を利用して、{{風力発電|ふうりょくはつでん|điện gió|1}}が行われています。',
        vi: 'Tận dụng ngọn gió Bắc mạnh mẽ này, người ta đang vận hành điện gió.'
      },
      {
        start: 40.5,
        end: 53.5,
        cloze: 'また、2月には大きな{{凧揚げ大会|たこあげたいかい|lễ hội thả diều|1}}があって、{{畳|たたみ|chiếu Tatami|1}}25枚分の大きな凧が揚げられ、毎年ニュースで{{放送されて|ほうそうされて|được phát sóng|1}}います。',
        vi: 'Ngoài ra, vào tháng 2 có lễ hội thả diều lớn, một con diều khổng lồ to bằng 25 chiếu tatami được thả lên và năm nào cũng được phát sóng trên bản tin thời sự.'
      }
    ],
    vocab: [
      { word: '故郷', kana: 'ふるさと', meaning: 'quê hương' },
      { word: '空っ風', kana: 'からっかぜ', meaning: 'gió khô và lạnh thổi từ núi xuống vào mùa đông' },
      { word: '湿る', kana: 'しめる', meaning: 'ẩm, ẩm ướt' },
      { word: '乾く', kana: 'かわく', meaning: 'khô, khô ráo' },
      { word: '越える', kana: 'こえる', meaning: 'vượt qua (núi)' },
      { word: '風力発電', kana: 'ふうりょくはつでん', meaning: ' phát điện bằng sức gió (điện gió)' },
      { word: '凧揚げ大会', kana: 'たこあげたいかい', meaning: 'lễ hội / đại hội thả diều' },
      { word: '畳', kana: 'たたみ', meaning: 'chiếu Tatami' }
    ]
  }
];
