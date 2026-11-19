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
        cloze: 'しかし、最近では伝統的な家に{{代わって|かわって|thay cho|1}}、{{鉄筋コンクリート|てっきんこんくりーと|bê tông cốt thép|1}}でできた家が{{ほとんど|ほとんど|hầu hết|2}}です。',
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
  },

// ===============================================================
// BÀI 7 (第 7 課): 世代を超えた交流 (Giao lưu qua các thế hệ)
// ===============================================================
  {
    id: 'listen_7_1',
    lesson: '第 7 課',
    code: 'Bài 7 - Nghe 1',
    title: 'Chợ đồ cũ Flea Market & Gây quỹ chó trợ giúp',
    jp_title: 'フリーマーケットと介助犬',
    audio: 'audio/listening/bai_7_1.mp3',
    duration_label: '01:20',
    type: 'dialogue',
    summary: 'Anna rủ Suzuki cùng tham gia hội chợ đồ cũ tại công viên Sakura và chia sẻ ý nghĩa gây quỹ huấn luyện chó trợ giúp người khuyết tật.',
    lines: [
      {
        speaker: 'アンナ',
        start: 0.0,
        end: 2.2,
        cloze: 'こんにちは。',
        vi: 'Xin chào.'
      },
      {
        speaker: '鈴木',
        start: 2.3,
        end: 6.2,
        cloze: 'こんにちは。今日は{{空いて|すいて|vắng, thưa người|2}}ますね。',
        vi: 'Chào bạn. Hôm nay vắng vẻ nhỉ.'
      },
      {
        speaker: 'アンナ',
        start: 6.3,
        end: 11.5,
        cloze: 'あのう、鈴木さんは{{フリーマーケット|フリーマーケット|chợ trời, hội chợ đồ cũ|1}}って{{興味|きょうみ|hứng thú, quan tâm|1}}がありますか。',
        vi: 'À này, bạn Suzuki có hứng thú với chợ trời Flea Market không?'
      },
      {
        speaker: '鈴木',
        start: 11.6,
        end: 13.0,
        cloze: 'え？',
        vi: 'Hả?'
      },
      {
        speaker: 'アンナ',
        start: 13.1,
        end: 21.0,
        cloze: '実は今度{{さくら公園|さくらこうえん|công viên Sakura|2}}でフリーマーケットがあるんです。それに{{参加|さんか|tham gia|1}}しようと思ってるんですけど。',
        vi: 'Thực ra sắp tới có hội chợ đồ cũ ở công viên Sakura. Mình định tham gia hội chợ đó.'
      },
      {
        speaker: '鈴木',
        start: 21.1,
        end: 23.0,
        cloze: 'へえ。',
        vi: 'Ồ thế à.'
      },
      {
        speaker: 'アンナ',
        start: 23.1,
        end: 32.0,
        cloze: '来週の日曜日なんですけど、もしお時間があったら鈴木さんにも来てもらえる{{かなと思って|かなとおもって|liệu có thể... hay không (lời rủ nhẹ nhàng)|1}}……。',
        vi: 'Vào Chủ nhật tuần sau, nếu bạn có thời gian thì mình nghĩ không biết bạn Suzuki có đến được không...'
      },
      {
        speaker: '鈴木',
        start: 32.1,
        end: 36.0,
        cloze: 'ああ、{{チラシ|チラシ|tờ rơi quảng cáo|2}}をもらったかも。',
        vi: 'À, hình như mình cũng nhận được tờ rơi rồi.'
      },
      {
        speaker: 'アンナ',
        start: 36.1,
        end: 46.5,
        cloze: 'このフリーマーケット、100ぐらいの{{お店が出る|おみせがでる|mở quầy hàng|2}}んですよ。{{中古品|ちゅうこひん|đồ cũ, hàng qua sử dụng|1}}にしては{{いい物|いいもの|đồ tốt|2}}があるって{{評判|ひょうばん|được đánh giá là, danh tiếng|1}}なんです。',
        vi: 'Hội chợ này có khoảng 100 gian hàng mở đấy. Đồ cũ nhưng được tiếng là có nhiều món rất tốt.'
      },
      {
        speaker: '鈴木',
        start: 46.6,
        end: 49.5,
        cloze: 'へえ、そうなんだ。',
        vi: 'Chà, vậy cơ à.'
      },
      {
        speaker: 'アンナ',
        start: 49.6,
        end: 63.5,
        cloze: 'しかも、{{売り上げ|うりあげ|doanh thu, tiền bán được|1}}の{{一部|いちぶ|một phần|1}}が{{介助犬|かいじょけん|chó trợ giúp (người khuyết tật)|1}}の{{育成|いくせい|nuôi dưỡng, huấn luyện|1}}のために{{寄付|きふ|quyên góp|1}}されるんです。例えば、300円のTシャツなら1枚{{につき|につき|cứ mỗi, trên mỗi|1}}30円の寄付ができるんです。',
        vi: 'Hơn nữa, một phần doanh thu sẽ được quyên góp cho việc huấn luyện chó trợ giúp người khuyết tật. Ví dụ, áo phông 300 yên thì cứ mỗi chiếc sẽ quyên góp được 30 yên.'
      },
      {
        speaker: '鈴木',
        start: 63.6,
        end: 69.5,
        cloze: 'ああ、いいね。あ、でも、雨だったらどうなるの？',
        vi: 'Ồ hay quá nhỉ. À nhưng nếu trời mưa thì sao?'
      },
      {
        speaker: 'アンナ',
        start: 69.6,
        end: 75.5,
        cloze: 'あ、そのときは、朝7時にホームページで{{延期|えんき|hoãn lại|1}}の{{お知らせ|おしらせ|thông báo|2}}があります。',
        vi: 'À lúc đó thì 7 giờ sáng sẽ có thông báo hoãn trên trang chủ.'
      },
      {
        speaker: '鈴木',
        start: 75.6,
        end: 78.5,
        cloze: 'そうなんだ。じゃ、行ってみようかな。',
        vi: 'Vậy à. Thế để mình thử đi xem sao.'
      },
      {
        speaker: 'アンナ',
        start: 78.6,
        end: 80.2,
        cloze: 'わあ、ありがとうございます！',
        vi: 'Oa, cảm ơn bạn nhiều nhé!'
      }
    ],
    vocab: [
      { word: 'フリーマーケット', kana: 'フリーマーケット', meaning: 'chợ trời, hội chợ đồ cũ' },
      { word: '中古品', kana: 'ちゅうこひん', meaning: 'đồ cũ, đồ đã qua sử dụng' },
      { word: '評判', kana: 'ひょうばん', meaning: 'được đánh giá là, danh tiếng' },
      { word: '介助犬', kana: 'かいじょけん', meaning: 'chó trợ giúp (người khuyết tật)' },
      { word: '育成', kana: 'いくせい', meaning: 'nuôi dưỡng, đào tạo, huấn luyện' },
      { word: '寄付', kana: 'きふ', meaning: 'quyên góp, ủng hộ' },
      { word: '売り上げ', kana: 'うりあげ', meaning: 'doanh thu, tiền bán được' },
      { word: '延期', kana: 'えんき', meaning: 'trì hoãn, lùi lịch' }
    ]
  },
  {
    id: 'listen_7_2',
    lesson: '第 7 課',
    code: 'Bài 7 - Nghe 2',
    title: 'Nghỉ giải lao tại sự kiện giao lưu thế hệ',
    jp_title: 'イベント準備の休憩と交流',
    audio: 'audio/listening/bai_7_2.mp3',
    duration_label: '01:54',
    type: 'dialogue',
    summary: 'Nhóm tình nguyện viên nghỉ giải lao 15 phút, lắng nghe bác Oono chia sẻ tâm sự sau khi nghỉ hưu và làm quen với cậu học sinh cấp ba Kondou rụt rè.',
    lines: [
      {
        speaker: 'スタッフ',
        start: 0.0,
        end: 4.0,
        cloze: 'じゃ、ここで15分、{{休憩|きゅうけい|nghỉ giải lao|1}}しましょう。',
        vi: 'Nào, chúng ta nghỉ giải lao 15 phút tại đây nhé.'
      },
      {
        speaker: '大野',
        start: 4.1,
        end: 12.0,
        cloze: 'あなたはさっき{{イラン|イラン|Iran|2}}から来たって言ってたけど、イランから日本までどのくらいかかるの？',
        vi: 'Lúc nãy cháu bảo từ Iran sang, thế từ Iran đến Nhật mất bao lâu vậy cháu?'
      },
      {
        speaker: 'マリヤム',
        start: 12.1,
        end: 17.5,
        cloze: 'えっと、{{飛行機|ひこうき|máy bay|2}}で14時間くらいかかります。',
        vi: 'Dạ, đi máy bay mất khoảng 14 tiếng ạ.'
      },
      {
        speaker: '大野',
        start: 17.6,
        end: 22.5,
        cloze: 'へえ。ずいぶん遠い所から{{来たもんだねえ|きたもんだねえ|đến từ nơi xa thật đấy (thán phục)|1}}。',
        vi: 'Chà, đến từ một nơi xa xôi thật đấy nhỉ.'
      },
      {
        speaker: 'マリヤム',
        start: 22.6,
        end: 24.5,
        cloze: 'はい。',
        vi: 'Dạ vâng.'
      },
      {
        speaker: '石井',
        start: 24.6,
        end: 28.5,
        cloze: 'お2人とも{{留学生|りゅうがくせい|du học sinh|1}}なんですか。',
        vi: 'Cả hai bạn đều là du học sinh à?'
      },
      {
        speaker: 'マリヤム・ナタポン',
        start: 28.6,
        end: 30.5,
        cloze: 'はい。',
        vi: 'Dạ vâng.'
      },
      {
        speaker: '大野',
        start: 30.6,
        end: 35.5,
        cloze: '{{偉い|えらい|đáng khen, giỏi giang|1}}よね。こうやって{{自分から|じぶんから|tự mình, chủ động|2}}参加するのは。',
        vi: 'Đáng khen thật đấy, chủ động tự mình tham gia thế này.'
      },
      {
        speaker: '川村',
        start: 35.6,
        end: 42.5,
        cloze: '大野さんはどうしてこのイベントに{{参加されよう|さんかされよう|dự định tham gia (kính ngữ)|1}}と思ったんですか。',
        vi: 'Bác Oono ơi, vì sao bác lại muốn tham gia sự kiện này thế ạ?'
      },
      {
        speaker: '大野',
        start: 42.6,
        end: 55.5,
        cloze: '僕？会社を{{定年退職|ていねんたいしょく|nghỉ hưu theo tuổi quy định|1}}してから、何かやらなきゃと{{思いながらも|おもいながらも|dù nghĩ rằng... nhưng|1}}、ただ時間ばかり{{過ぎて|すぎて|trôi qua|2}}しまっていたんだよ。',
        vi: 'Bác hả? Kể từ lúc nghỉ hưu ở công ty, dù vẫn nghĩ bụng phải làm việc gì đó, nhưng thời gian cứ thế trôi vùn vụt đi mất thôi.'
      },
      {
        speaker: '川村',
        start: 55.6,
        end: 57.5,
        cloze: 'はあ。',
        vi: 'Dạ.'
      },
      {
        speaker: '大野',
        start: 57.6,
        end: 72.0,
        cloze: 'うちのかみさんが毎日楽しそうにどこかへ出かけるのを{{見るにつけ|みるにつけ|cứ mỗi lần nhìn thấy là...|1}}、{{うらやましく|うらやましく|ghen tị, thèm muốn|1}}なっちゃってね。たまたま、{{市のお知らせ|しのおしらせ|thông báo của thành phố|2}}で、このイベントのことを知って、参加してみようかなと思ったわけ。',
        vi: 'Bác cứ mỗi lần nhìn thấy bà nhà ngày nào cũng vui vẻ đi đâu đó là lại thấy ghen tị quá đỗi. Tình cờ đọc thông báo của thành phố biết về sự kiện này, bác mới thử tham gia xem sao.'
      },
      {
        speaker: '川村',
        start: 72.1,
        end: 74.5,
        cloze: 'そうだったんですか。',
        vi: 'Ra là thế ạ.'
      },
      {
        speaker: '大野',
        start: 74.6,
        end: 84.5,
        cloze: '来てみたら、人が多くて、びっくりしたよ。こんなに多いんじゃ、同じグループの人の{{名前さえ|なまえさえ|ngay cả tên cũng...|1}}{{覚えられない|おぼえられない|không thể nhớ được|2}}よ。',
        vi: 'Đến nơi thấy đông người quá làm bác hết cả hồn. Đông thế này thì đến tên người trong cùng nhóm còn chẳng nhớ nổi ấy chứ.'
      },
      {
        speaker: '川村',
        start: 84.6,
        end: 91.0,
        cloze: '大丈夫ですよ。このイベントの{{準備|じゅんび|chuẩn bị|1}}って3か月ぐらい続きますから。ね？',
        vi: 'Không sao đâu bác ơi. Khâu chuẩn bị cho sự kiện này kéo dài tận khoảng 3 tháng lận mà. Phải không ạ?'
      },
      {
        speaker: '石井',
        start: 91.1,
        end: 93.0,
        cloze: 'ええ。',
        vi: 'Đúng vậy.'
      },
      {
        speaker: '川村',
        start: 93.1,
        end: 98.5,
        cloze: 'えっと……{{近藤|こんどう|Kondou|2}}さんでしたよね？{{高校生|こうこうせい|học sinh cấp ba|2}}？',
        vi: 'À... cháu là Kondou phải không? Học sinh cấp ba nhỉ?'
      },
      {
        speaker: '近藤',
        start: 98.6,
        end: 101.0,
        cloze: 'はい。そうっす。',
        vi: 'Vâng, đúng rồi ạ.'
      },
      {
        speaker: '川村',
        start: 101.1,
        end: 105.5,
        cloze: '{{緊張|きんちょう|căng thẳng, hồi hộp|1}}しなくても大丈夫よ。みんな初めて会ったんだし。',
        vi: 'Không cần phải căng thẳng đâu nhé, mọi người ai cũng mới gặp lần đầu cả mà.'
      },
      {
        speaker: '近藤',
        start: 105.6,
        end: 110.0,
        cloze: '緊張っていうか、自分、ちょっと{{人見知り|ひとみしり|ngại người lạ, nhút nhát|1}}するほうなんで……。',
        vi: 'Cũng không hẳn là căng thẳng ạ, tính cháu hơi ngại người lạ một chút...'
      },
      {
        speaker: '大野',
        start: 110.1,
        end: 113.0,
        cloze: 'ま、だんだん{{慣れる|なれる|quen dần|1}}よ。{{男同士|おとこどうし|cánh đàn ông với nhau|1}}、頑張ろうな。君も一緒にな。',
        vi: 'Ấy, rồi sẽ quen dần thôi! Cánh đàn ông tụi mình cùng cố gắng nhé. Cả cháu nữa đấy nhé!'
      },
      {
        speaker: 'ナタポン',
        start: 113.1,
        end: 114.2,
        cloze: 'あ、はい。',
        vi: 'Dạ vâng ạ.'
      }
    ],
    vocab: [
      { word: '定年退職', kana: 'ていねんたいしょく', meaning: 'nghỉ hưu theo độ tuổi' },
      { word: '留学生', kana: 'りゅうがくせい', meaning: 'du học sinh' },
      { word: '見るにつけ', kana: 'みるにつけ', meaning: 'cứ mỗi lần nhìn thấy là lại...' },
      { word: 'うらやましい', kana: 'うらやましい', meaning: 'ghen tị, thèm muốn' },
      { word: '名前さえ', kana: 'なまえさえ', meaning: 'ngay cả cái tên cũng...' },
      { word: '人見知り', kana: 'ひとみしり', meaning: 'ngại người lạ, nhút nhát' },
      { word: '男同士', kana: 'おとこどうし', meaning: 'cánh đàn ông với nhau' },
      { word: '思いながらも', kana: 'おもいながらも', meaning: 'dù nghĩ như vậy nhưng...' }
    ]
  },
  {
    id: 'listen_7_3',
    lesson: '第 7 課',
    code: 'Bài 7 - Nghe 3',
    title: 'Cùng vẽ poster sự kiện & Làm quen kết bạn',
    jp_title: 'ポスター作りとニックネーム',
    audio: 'audio/listening/bai_7_3.mp3',
    duration_label: '01:33',
    type: 'dialogue',
    summary: 'Natapon cùng cậu bạn học sinh cấp ba Taku (Kondo) cùng nhau vẽ poster cây lớn cho sự kiện, chia sẻ về tuổi tác và thỏa thuận cách xưng hô thân mật.',
    lines: [
      {
        speaker: 'ナタポン',
        start: 0.0,
        end: 11.5,
        cloze: 'さて、ポスターの{{作成|さくせい|tạo, làm, vẽ|1}}だけど、どんなデザインにしようか。',
        vi: 'Nào, về phần vẽ poster thì tụi mình nên chọn thiết kế thế nào đây nhỉ?'
      },
      {
        speaker: 'タク',
        start: 11.6,
        end: 23.5,
        cloze: 'イベントのテーマが「世代を超えた交流」だから、{{真ん中|まんなか|chính giữa|1}}に大きな木を描くのはどうっすか？',
        vi: 'Chủ đề sự kiện là "Giao lưu qua các thế hệ", hay là mình vẽ một cái cây to tướng ở chính giữa đi anh?'
      },
      {
        speaker: 'ナタポン',
        start: 23.6,
        end: 35.0,
        cloze: 'いいね！木の{{枝|えだ|cành cây|2}}にいろんな年代の人たちの{{笑顔|えがお|khuôn mặt cười|1}}を描いていくんだね。',
        vi: 'Hay đấy! Trên các cành cây mình sẽ vẽ khuôn mặt rạng rỡ của mọi người ở nhiều lứa tuổi khác nhau nhỉ.'
      },
      {
        speaker: 'タク',
        start: 35.1,
        end: 45.0,
        cloze: 'そうそう！でも自分、絵を描くのは{{からっきし|からっきし|hoàn toàn không, dốt đặc|1}}苦手なんすよ……。',
        vi: 'Chuẩn luôn ạ! Cơ mà khoản vẽ vời thì em dốt đặc cán mai luôn ấy...'
      },
      {
        speaker: 'ナタポン',
        start: 45.1,
        end: 55.0,
        cloze: '大丈夫、僕もそんなに{{得意|とくい|giỏi, đắc ý|2}}じゃないから、一緒に{{手伝い|てつだい|giúp đỡ|1}}ながらやろう。',
        vi: 'Không sao đâu, anh cũng chẳng khéo tay gì cho cam, tụi mình cùng đỡ đần nhau làm nhé.'
      },
      {
        speaker: 'タク',
        start: 55.1,
        end: 63.5,
        cloze: 'ありがとうございます！ナタポンさんは今、おいくつなんですか？',
        vi: 'Cảm ơn anh! Mà anh Natapon năm nay bao nhiêu tuổi rồi ạ?'
      },
      {
        speaker: 'ナタポン',
        start: 63.6,
        end: 71.0,
        cloze: '僕は23歳だよ。{{大学院|だいがくいん|cao học|1}}で勉強してるんだ。',
        vi: 'Anh 23 tuổi rồi. Đang học cao học ở đây.'
      },
      {
        speaker: 'タク',
        start: 71.1,
        end: 80.5,
        cloze: 'へえ、23歳ですか！じゃあ僕より6歳{{年上|としうえ|lớn tuổi hơn|1}}ですね。自分は今17歳、高校2年生です。',
        vi: 'Ô, 23 tuổi ạ! Vậy là lớn hơn em tận 6 tuổi rồi. Em năm nay mới 17, học lớp 11.'
      },
      {
        speaker: 'ナタポン',
        start: 80.6,
        end: 88.0,
        cloze: 'そうなんだ。でもそんなに{{敬語|けいご|kính ngữ|1}}を使わなくてもいいよ。遠慮しないで。',
        vi: 'Ra vậy. Nhưng em không cần phải dùng kính ngữ khách sáo thế đâu. Đừng ngại nhé.'
      },
      {
        speaker: 'タク',
        start: 88.1,
        end: 93.2,
        cloze: 'じゃあ……「ナタポンさん」って呼んでもいいですか？僕のことは「タク」って呼んでください！',
        vi: 'Thế thì... em gọi anh là anh Natapon nha? Còn anh cứ gọi em là Taku nhé!'
      }
    ],
    vocab: [
      { word: 'からっきし', kana: 'からっきし', meaning: 'hoàn toàn không, dốt đặc (tiêu cực)' },
      { word: '年上', kana: 'としうえ', meaning: 'lớn tuổi hơn' },
      { word: '作成', kana: 'さくせい', meaning: 'tạo ra, làm, sáng tác' },
      { word: '手伝う', kana: 'てつだう', meaning: 'giúp đỡ' },
      { word: '真ん中', kana: 'まんなか', meaning: 'ở chính giữa' },
      { word: '大学院', kana: 'だいがくいん', meaning: 'cao học' },
      { word: '敬語', kana: 'けいご', meaning: 'kính ngữ' }
    ]
  },
  {
    id: 'listen_7_4',
    lesson: '第 7 課',
    code: 'Bài 7 - Nghe 4',
    title: 'Chuyến Homestay 1 tuần tại tỉnh Shizuoka',
    jp_title: '静岡県へのホームステイ体験',
    audio: 'audio/listening/bai_7_4.mp3',
    duration_label: '01:56',
    type: 'monologue',
    summary: 'Bài chia sẻ cảm xúc về kỳ homestay 1 tuần tại Shizuoka: ngắm cảnh biển, khâm phục sức khỏe của bà cụ 80 tuổi trên đồng dưa hấu và tình cảm gia đình ấm áp.',
    lines: [
      {
        start: 0.0,
        end: 9.0,
        cloze: '私は夏休みに1週間、{{静岡県|しずおかけん|tỉnh Shizuoka|2}}へ{{ホームステイ|ホームステイ|ở trọ cùng người bản xứ|1}}に行ってきました。静岡県まで{{電車|でんしゃ|tàu điện|2}}で行きました。',
        vi: 'Kỳ nghỉ hè vừa rồi, tôi đã đi homestay 1 tuần tại tỉnh Shizuoka. Tôi đi bằng tàu điện đến tỉnh Shizuoka.'
      },
      {
        start: 9.1,
        end: 20.5,
        cloze: '夏休みなので、電車が{{混んでいる|こんでいる|đông đúc|2}}んじゃないかと思っていましたが、{{予想に反して|よそうにはんして|trái ngược với dự đoán|1}}{{空いて|すいて|vắng khách|2}}いて、ゆっくり{{景色|けしき|phong cảnh|1}}を楽しむことができました。',
        vi: 'Vì đang là kỳ nghỉ hè nên tôi cứ ngỡ tàu sẽ rất đông đúc, thế nhưng trái ngược với dự đoán, tàu lại khá vắng nên tôi đã có thể thong thả thưởng ngoạn phong cảnh.'
      },
      {
        start: 20.6,
        end: 25.5,
        cloze: '駅に着くと、{{ホストファミリー|ホストファミリー|gia đình chủ nhà bản xứ|1}}が{{笑顔|えがお|nụ cười rạng rỡ|1}}で{{迎えて|むかえて|đón tiếp|1}}くれました。',
        vi: 'Khi tới ga, gia đình bản xứ đã niềm nở đón tiếp tôi với nụ cười rạng rỡ trên môi.'
      },
      {
        start: 25.6,
        end: 35.0,
        cloze: 'ホストファミリーは私にたくさん話しかけてくれましたが、{{最初のころ|さいしょのころ|khoảng thời gian đầu|2}}は{{緊張|きんちょう|căng thẳng, e dè|1}}してうまく話せませんでした。',
        vi: 'Gia đình chủ nhà bắt chuyện với tôi rất nhiều, nhưng lúc ban đầu tôi vì căng thẳng nên không thể nói chuyện trôi chảy được.'
      },
      {
        start: 35.1,
        end: 43.0,
        cloze: 'でも、いろいろなことを一緒に{{体験するうちに|たいけんするうちに|trong lúc cùng nhau trải nghiệm|1}}だんだん{{親しく|したしく|thân thiết, gần gũi|1}}なりました。',
        vi: 'Thế nhưng, trong quá trình cùng nhau trải nghiệm nhiều điều, chúng tôi đã dần trở nên thân thiết, gần gũi hơn.'
      },
      {
        start: 43.1,
        end: 57.5,
        cloze: '着いた次の日は{{海|うみ|biển|2}}に行きました。私のふるさとは山に{{囲まれた|かこまれた|bao bọc, vây quanh|1}}所なので、初めて広い海を見て{{感動しました|かんどうしました|vô cùng xúc động|1}}。ホストファミリーと一緒に、海で{{泳いだ|およいだ|bơi lội|2}}のはいい{{思い出|おもいで|kỷ niệm đẹp|1}}です。',
        vi: 'Ngày hôm sau khi đến nơi, chúng tôi đã đi ra biển. Vì quê hương tôi là vùng đất được bao bọc bởi núi non, nên lần đầu tiên được tận mắt nhìn ngắm biển rộng mênh mông, tôi vô cùng xúc động. Cùng gia đình chủ nhà bơi lội dưới biển là một kỷ niệm thật đẹp.'
      },
      {
        start: 57.6,
        end: 72.0,
        cloze: 'また別の日は、ホストファミリーのおばあさんの{{畑|はたけ|ruộng, nương rẫy|1}}へ行って仕事を手伝いました。80歳なのに、おばあさんは{{歩き方からして|あるきかたからして|ngay từ dáng đi đã...|1}}{{若々しくて|わかわかしくて|trẻ trung, tràn đầy sức sống|1}}{{驚きました|おどろきました|ngạc nhiên, kinh ngạc|1}}。',
        vi: 'Lại một ngày khác, tôi ra đồng giúp đỡ công việc cho bà cụ của gia đình chủ nhà. Dù đã 80 tuổi nhưng ngay từ dáng đi của bà đã toát lên vẻ trẻ trung khiến tôi vô cùng kinh ngạc.'
      },
      {
        start: 72.1,
        end: 83.5,
        cloze: '大きなスイカを{{持ち上げて|もちあげて|nhấc bổng lên|1}}、{{トラック|トラック|xe tải|2}}まで運んでいました。仕事が終わったあとで、みんなでスイカを食べました。{{甘くて|あまくて|ngọt ngào|2}}おいしかったです。',
        vi: 'Bà nhấc bổng cả những quả dưa hấu to bự rồi vác ra tận xe tải. Sau khi xong việc, cả nhà cùng nhau ngồi ăn dưa hấu. Dưa vừa ngọt vừa ngon tuyệt.'
      },
      {
        start: 83.6,
        end: 97.0,
        cloze: '帰るときは本当に悲しく、{{涙|なみだ|nước mắt|2}}が出てしまいました。帰ってからしばらくたったある日、ホストファミリーから{{荷物|にもつ|kiện hàng, bưu phẩm|2}}が{{届きました|とどきました|gửi tới nơi|1}}。',
        vi: 'Lúc chia tay ra về, tôi thật sự rất buồn và đã bật khóc. Một ngày nọ sau khi về được một thời gian, tôi nhận được một kiện hàng do gia đình chủ nhà gửi tới.'
      },
      {
        start: 97.1,
        end: 116.2,
        cloze: '中におばあさんが作った野菜と{{孫|まご|cháu nội/ngoại|1}}のゆうた君が描いてくれた、私と家族の絵が入っていました。日本の家族ができたような気がしました。ホームステイに{{参加して|さんかして|tham gia|1}}本当によかったです。',
        vi: 'Bên trong có những thứ rau củ do chính tay bà trồng, và bức tranh vẽ tôi cùng cả gia đình do bé Yuuta - cháu của bà vẽ tặng. Tôi cảm giác như mình đã có thêm một gia đình thực sự ở Nhật Bản vậy. Tham gia chuyến homestay này thật sự là một quyết định vô cùng tuyệt vời.'
      }
    ],
    vocab: [
      { word: 'ホームステイ', kana: 'ホームステイ', meaning: 'homestay, ở trọ cùng gia đình bản xứ' },
      { word: '予想に反して', kana: 'よそうにはんして', meaning: 'trái ngược với dự đoán' },
      { word: '若々しい', kana: 'わかわかしい', meaning: 'trẻ trung, tươi trẻ' },
      { word: '歩き方からして', kana: 'あるきかたからして', meaning: 'ngay từ dáng đi đã...' },
      { word: '持ち上げる', kana: 'もちあげる', meaning: 'nhấc lên, nâng lên' },
      { word: '感動する', kana: 'かんどうする', meaning: 'cảm động, xúc động' },
      { word: '思い出', kana: 'おもいで', meaning: 'kỷ niệm, ký ức đẹp' },
      { word: '孫', kana: 'まご', meaning: 'cháu (nội / ngoại)' }
    ]
  }
];

