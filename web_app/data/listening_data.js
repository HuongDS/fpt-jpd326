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
    summary: 'Mọi người phân công Natapon và cậu học sinh cấp ba Kondou (Taku) cùng vẽ một cái cây lớn lên poster sự kiện. Bác Oono ghé khen rồi hai anh em làm quen, hỏi tuổi và cách xưng hô thân mật.',
    lines: [
      {
        speaker: '石井',
        start: 0.0,
        end: 7.0,
        cloze: 'じゃあ、今日はイベントの{{ポスター|ポスター|áp phích, poster|1}}を{{描いていきましょう|かいていきましょう|cùng nhau vẽ nào|2}}。',
        vi: 'Nào, hôm nay chúng ta hãy cùng nhau bắt tay vào vẽ áp phích (poster) cho sự kiện nhé.'
      },
      {
        speaker: '川村',
        start: 7.1,
        end: 10.5,
        cloze: '{{絵が上手|えがじょうず|vẽ tranh giỏi, khéo vẽ|1}}な人、いますか？',
        vi: 'Ở đây có ai vẽ tranh đẹp không nhỉ?'
      },
      {
        speaker: 'マリヤム',
        start: 10.6,
        end: 13.5,
        cloze: 'あ、ナタポンさんが{{上手|じょうず|giỏi, khéo tay|1}}ですよ。',
        vi: 'A, bạn Natapon vẽ đẹp lắm đấy ạ.'
      },
      {
        speaker: '川村',
        start: 13.6,
        end: 16.0,
        cloze: 'じゃあ、{{描いてもらえますか|かいてもらえますか|nhờ bạn vẽ giúp có được không|1}}？',
        vi: 'Vậy thì nhờ bạn vẽ giúp mọi người được không?'
      },
      {
        speaker: 'ナタポン',
        start: 16.1,
        end: 18.0,
        cloze: 'あ、はい。',
        vi: 'À, dạ vâng ạ.'
      },
      {
        speaker: '川村',
        start: 18.1,
        end: 22.0,
        cloze: 'じゃ、よろしくね。近藤くん、{{手伝ってあげて|てつだってあげて|phụ giúp bạn ấy nhé|1}}。',
        vi: 'Vậy nhờ bạn nhé. Kondou ơi, em phụ giúp bạn ấy nha.'
      },
      {
        speaker: '近藤（タク）',
        start: 22.1,
        end: 23.5,
        cloze: 'はい。',
        vi: 'Vâng ạ.'
      },
      {
        speaker: '川村',
        start: 23.6,
        end: 29.0,
        cloze: 'じゃあ、2人でこの{{紙|かみ|tờ giấy|2}}に{{大きな木|おおきなき|cái cây lớn|1}}を描いてね。はい、ペン。',
        vi: 'Vậy hai đứa cùng vẽ một cái cây thật lớn lên tờ giấy này nhé. Đây, bút đây.'
      },
      {
        speaker: '近藤（タク）',
        start: 29.1,
        end: 31.0,
        cloze: 'はい。',
        vi: 'Vâng.'
      },
      {
        speaker: '大野',
        start: 34.0,
        end: 43.0,
        cloze: 'おお、{{上手なもんだ|じょうずなもんだ|khéo tay thật đấy (cảm thán)|1}}。僕は絵は{{からっきしダメ|からっきしダメ|hoàn toàn không được, dốt đặc|1}}でね。簡単な{{花さえ|はなさえ|ngay cả bông hoa|1}}うまく{{描けない|かけない|không thể vẽ được|2}}んだよ。',
        vi: 'Ồ, vẽ khéo thật đấy! Bác thì khoản vẽ vời là dốt đặc cán mai. Ngay cả một bông hoa đơn giản bác cũng chẳng vẽ nổi cho ra hồn.'
      },
      {
        speaker: 'ナタポン',
        start: 43.1,
        end: 46.0,
        cloze: 'ええ、そうなんですか？',
        vi: 'Ồ, thật thế sao bác?'
      },
      {
        speaker: '川村',
        start: 46.1,
        end: 50.0,
        cloze: '大野さーん！こっちを{{手伝ってください|てつだってください|hãy giúp bên này với|2}}！',
        vi: 'Bác Oono ơi! Qua phụ giúp bên này với ạ!'
      },
      {
        speaker: '大野',
        start: 50.1,
        end: 52.5,
        cloze: 'はいはーい。',
        vi: 'Vâng vâng, tới ngay đây!'
      },
      {
        speaker: 'ナタポン',
        start: 54.0,
        end: 58.5,
        cloze: 'あの、すみません。お名前、何て{{呼べばいい|よべばいい|nên gọi như thế nào|1}}ですか？',
        vi: 'À, xin lỗi, mình nên gọi tên bạn như thế nào thì được nhỉ?'
      },
      {
        speaker: '近藤（タク）',
        start: 58.6,
        end: 61.0,
        cloze: 'ああ、タクで{{いいっすよ|いいっすよ|được rồi ạ (khẩu ngữ giới trẻ)|2}}。',
        vi: 'À, cứ gọi em là Taku là được rồi ạ.'
      },
      {
        speaker: 'ナタポン',
        start: 61.1,
        end: 63.0,
        cloze: 'タクさん？',
        vi: 'Bạn Taku à?'
      },
      {
        speaker: '近藤（タク）',
        start: 63.1,
        end: 72.0,
        cloze: 'いや、本当は{{拓也|たくや|Takuya (tên thật)|2}}って言うんすけど、みんな{{自分のこと|じぶんのこと|bản thân mình|1}}をタクって呼ぶんで。で、{{そちら|そちら|đằng ấy, phía bạn|2}}は？',
        vi: 'Không, thật ra tên em là Takuya, cơ mà mọi người toàn gọi em là Taku thôi. Thế còn anh thì sao?'
      },
      {
        speaker: 'ナタポン',
        start: 72.1,
        end: 75.5,
        cloze: '私？ナタポンと{{呼んでください|よんでください|hãy gọi là|1}}。',
        vi: 'Mình á? Cứ gọi mình là Natapon nhé.'
      },
      {
        speaker: '近藤（タク）',
        start: 75.6,
        end: 78.5,
        cloze: 'ナタポンさん、{{何歳っすか|なんさいっすか|bao nhiêu tuổi vậy ạ|1}}？',
        vi: 'Anh Natapon bao nhiêu tuổi rồi ạ?'
      },
      {
        speaker: 'ナタポン',
        start: 78.6,
        end: 81.0,
        cloze: 'え？あ、23です。',
        vi: 'Hả? À, mình 23 tuổi.'
      },
      {
        speaker: '近藤（タク）',
        start: 81.1,
        end: 86.0,
        cloze: 'えっ、自分より{{6個上|ろっこうえ|lớn hơn 6 tuổi|1}}っすね！{{よろしくお願いします|よろしくおねがいします|rất mong được giúp đỡ|1}}！',
        vi: 'Ồ, vậy là lớn hơn em tận 6 tuổi lận! Rất mong được anh chỉ bảo ạ!'
      },
      {
        speaker: 'ナタポン',
        start: 86.1,
        end: 89.0,
        cloze: 'あ、{{こちらこそ|こちらこそ|chính tôi mới là người phải nói câu đó|1}}。',
        vi: 'À, mình cũng rất vui được làm quen với em.'
      }
    ],
    vocab: [
      { word: 'からっきしダメ', kana: 'からっきしだめ', meaning: 'hoàn toàn không được, dốt đặc (đi với phủ định/tiêu cực)' },
      { word: '～なもんだ', kana: '～なもんだ', meaning: 'thật là... đấy nhỉ (cảm thán, thán phục)' },
      { word: '～さえ', kana: '～さえ', meaning: 'ngay cả... cũng...' },
      { word: '手伝う', kana: 'てつだう', meaning: 'phụ giúp, giúp đỡ' },
      { word: '6個上', kana: 'ろっこうえ', meaning: 'hơn 6 tuổi (cách nói thân mật trong hội thoại)' },
      { word: '～っす', kana: '～っす', meaning: 'cách nói rút gọn thân mật của です trong giới trẻ' },
      { word: 'こちらこそ', kana: 'こちらこそ', meaning: 'chính tôi mới là người phải nói câu đó' }
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
  },

// ===============================================================
// BÀI 8 (第 8 課): 職場の人間関係・気持ちの伝え方 (Quan hệ nơi làm việc & Cách truyền đạt cảm xúc)
// ===============================================================
  {
    id: 'listen_8_1',
    lesson: '第 8 課',
    code: 'Bài 8 - Nghe 1',
    title: 'Xin phép quản lý nghỉ làm thêm một tuần vì gia đình sang thăm',
    jp_title: 'アルバイトの休暇願いとシフト',
    audio: 'audio/listening/bai_8_1.mp3',
    duration_label: '01:06',
    type: 'dialogue',
    summary: 'Bạn du học sinh Rohan lịch sự xin phép quản lý cửa hàng cho nghỉ làm 1 tuần vào cuối tháng để đón tiếp gia đình từ quê nhà sang thăm và đã chủ động nhờ người làm thay.',
    lines: [
      {
        speaker: 'ローハン',
        start: 0.0,
        end: 7.0,
        cloze: 'あのー、店長、今{{よろしいですか|よろしいですか|có tiện không ạ (kính ngữ)|1}}。',
        vi: 'Dạ quản lý ơi, bây giờ anh có tiện không ạ?'
      },
      {
        speaker: '店長',
        start: 7.1,
        end: 10.0,
        cloze: 'ああ、ローハンさん。どうしたの？',
        vi: 'À, Rohan đấy à. Có chuyện gì thế em?'
      },
      {
        speaker: 'ローハン',
        start: 10.1,
        end: 12.0,
        cloze: '来月の{{シフト|シフト|ca làm việc, lịch làm|1}}のことなんですが。',
        vi: 'Dạ về lịch làm việc (shift) tháng sau của em ấy ạ.'
      },
      {
        speaker: '店長',
        start: 12.1,
        end: 14.0,
        cloze: '来月のシフト？',
        vi: 'Ca làm tháng sau à?'
      },
      {
        speaker: 'ローハン',
        start: 14.1,
        end: 23.0,
        cloze: 'はい。すみませんが、来月1週間、アルバイトを{{休ませていただけませんか|やすませていただけませんか|cho phép em được xin nghỉ có được không ạ|1}}。実は国から{{家族|かぞく|gia đình|2}}が来るんです。',
        vi: 'Dạ vâng. Xin lỗi anh nhưng tháng sau cho phép em xin nghỉ làm thêm 1 tuần được không ạ? Thực ra gia đình em từ bên nước sang chơi ạ.'
      },
      {
        speaker: '店長',
        start: 23.1,
        end: 27.0,
        cloze: 'ああ、そう。それで、いつからいつまで？',
        vi: 'À ra vậy. Thế từ ngày nào đến ngày nào thế em?'
      },
      {
        speaker: 'ローハン',
        start: 27.1,
        end: 31.0,
        cloze: '23日から30日までなんですが。',
        vi: 'Dạ từ ngày 23 đến ngày 30 ạ.'
      },
      {
        speaker: '店長',
        start: 31.1,
        end: 37.5,
        cloze: 'え？{{月末|げつまつ|cuối tháng|1}}？うーん、{{忙しいとき|いそがしいとき|thời điểm bận rộn|2}}だねえ。',
        vi: 'Hả? Cuối tháng á? Ừm... tầm đấy bận lắm đấy em ơi.'
      },
      {
        speaker: 'ローハン',
        start: 37.6,
        end: 53.0,
        cloze: 'ああー、すみません。でも、みんな日本語がわからない{{ものですから|ものですから|vì là, do là (lý do khách quan)|1}}、私が{{案内しなければならなくて|あんないしなければならなくて|phải hướng dẫn, dẫn đường|1}}。その間、私の{{代わりに|かわりに|thay cho, thay thế|1}}田中さんが入るって言ってくださっているんですが。',
        vi: 'Dạ em thật sự xin lỗi anh. Cơ mà cả nhà em chẳng ai biết tiếng Nhật cả, nên em buộc phải đi cùng hướng dẫn. Trong khoảng thời gian đó, chị Tanaka đã đồng ý đi làm thay ca cho em rồi ạ.'
      },
      {
        speaker: '店長',
        start: 53.1,
        end: 57.0,
        cloze: 'ああ、そうか。じゃあ{{大丈夫|だいじょうぶ|ổn thỏa, không sao|2}}だね。わかった。',
        vi: 'À ra thế à! Vậy thì ổn rồi, không sao đâu. Anh đồng ý nhé.'
      },
      {
        speaker: 'ローハン',
        start: 57.1,
        end: 61.0,
        cloze: 'ありがとうございます。{{ご迷惑をかけて|ごめいわくをかけて|làm phiền, gây bất tiện|1}}すみません。',
        vi: 'Em cảm ơn anh nhiều lắm ạ. Em xin lỗi vì đã làm phiền và gây bất tiện cho quán.'
      }
    ],
    vocab: [
      { word: 'シフト', kana: 'シフト', meaning: 'ca làm việc (shift)' },
      { word: '休ませていただけませんか', kana: 'やすませていただけませんか', meaning: 'cho phép tôi xin nghỉ có được không ạ' },
      { word: '月末', kana: 'げつまつ', meaning: 'cuối tháng' },
      { word: '～ものですから', kana: '～ものですから', meaning: 'bởi vì là... (giải thích lý do bất khả kháng, lịch sự)' },
      { word: '案内する', kana: 'あんないする', meaning: 'hướng dẫn, dẫn đường' },
      { word: '～代わりに', kana: '～かわりに', meaning: 'thay cho, thay vì...' },
      { word: '迷惑をかける', kana: 'めいわくをかける', meaning: 'làm phiền, gây phiền toái cho người khác' }
    ]
  },
  {
    id: 'listen_8_2',
    lesson: '第 8 課',
    code: 'Bài 8 - Nghe 2',
    title: 'Khách gọi thêm bia sau Last order & Bị quản lý nhắc nhở',
    jp_title: 'ラストオーダーと追加注文',
    audio: 'audio/listening/bai_8_2.mp3',
    duration_label: '00:56',
    type: 'dialogue',
    summary: 'Nhân viên quán ăn tâm sự về tình huống khó xử khi khách đã bảo không gọi nữa nhưng sau Last order lại đòi gọi thêm bia, khiến bản thân bị quản lý nhắc nhở.',
    lines: [
      {
        speaker: '店員A',
        start: 0.0,
        end: 9.5,
        cloze: 'あーあ、今日は{{大変|たいへん|vất vả, mệt mỏi|2}}だったんだよ。{{ラストオーダー|ラストオーダー|lượt gọi món cuối cùng|1}}のあとで、{{追加|ついか|thêm vào, bổ sung|1}}の{{注文|ちゅうもん|gọi món, đặt hàng|1}}をするお客さんがいて。',
        vi: 'Haizz, hôm nay thật là mệt mỏi quá đi. Sau giờ gọi món cuối cùng mà lại có khách cứ đòi gọi thêm.'
      },
      {
        speaker: '店員B',
        start: 9.6,
        end: 13.0,
        cloze: 'へえー、そうだったんだ。それで、どうしたの？',
        vi: 'Thế á? Vậy rồi cậu xử lý sao?'
      },
      {
        speaker: '店員A',
        start: 13.1,
        end: 25.0,
        cloze: 'ラストオーダーだって僕が言いに行った時には、そのお客さん、「はーい、もう注文ないよー」って{{言ったくせに|いったくせに|nói thế mà lại...|1}}、そんなこと言ってないって、{{生ビール|なまビール|bia tươi|1}}を追加で注文したんだよ。',
        vi: 'Lúc mình đến báo hết giờ gọi món, khách rõ ràng bảo "Được rồi, không gọi gì nữa đâu", thế mà sau đấy lại bảo chưa từng nói thế rồi gọi thêm bia tươi.'
      },
      {
        speaker: '店員B',
        start: 25.1,
        end: 27.5,
        cloze: 'へえー、大変だったね。',
        vi: 'Chà, đúng là vất vả thật đấy.'
      },
      {
        speaker: '店員A',
        start: 27.6,
        end: 31.0,
        cloze: '注文を{{受けたせいで|うけたせいで|chỉ vì đã nhận... nên|1}}、{{店長|てんちょう|cửa hàng trưởng, quản lý|2}}にも{{注意されちゃった|ちゅういされちゃった|bị nhắc nhở|1}}んだ。',
        vi: 'Chỉ tại nhận đơn ấy mà mình còn bị quản lý nhắc nhở nữa chứ.'
      },
      {
        speaker: '店員B',
        start: 31.1,
        end: 33.0,
        cloze: '{{断らなかった|ことわらなかった|đã không từ chối|1}}の？',
        vi: 'Cậu không từ chối à?'
      },
      {
        speaker: '店員A',
        start: 33.1,
        end: 35.0,
        cloze: 'そりゃあ、{{断れない|ことわれない|không thể từ chối|1}}よ。',
        vi: 'Thế thì làm sao mà từ chối được cơ chứ.'
      },
      {
        speaker: '店員C',
        start: 35.1,
        end: 37.0,
        cloze: 'そうですよねー。',
        vi: 'Đúng vậy thật đấy ạ.'
      },
      {
        speaker: '店員A',
        start: 37.1,
        end: 44.0,
        cloze: '{{無理に決まってる|むりにきまってる|chắc chắn là không thể nào rồi|1}}よ。お客さんを{{怒らせたら|おこらせたら|làm cho tức giận|1}}大変だからね。ま、お客さんは{{喜んで|よろこんで|vui vẻ, hài lòng|2}}帰ってくれたけど。',
        vi: 'Chắc chắn là không từ chối được rồi. Nếu làm khách phật ý nổi giận thì to chuyện lắm. Cơ mà ít ra khách cũng hài lòng ra về.'
      },
      {
        speaker: '店員B',
        start: 44.1,
        end: 49.0,
        cloze: 'うーん、でも、受ける前に店長に{{聞けばよかった|きけばよかった|giá mà đã hỏi... thì tốt|1}}かもね。',
        vi: 'Ừm, nhưng trước khi nhận có lẽ cậu cứ hỏi ý kiến quản lý trước thì tốt hơn.'
      },
      {
        speaker: '店員A',
        start: 49.1,
        end: 51.0,
        cloze: 'うーん。',
        vi: 'Ừm...'
      }
    ],
    vocab: [
      { word: 'ラストオーダー', kana: 'ラストオーダー', meaning: 'lượt gọi món cuối cùng (last order)' },
      { word: '追加', kana: 'ついか', meaning: 'thêm vào, bổ sung' },
      { word: '～くせに', kana: '～くせに', meaning: 'mặc dù... thế mà (thái độ trách móc, bất mãn)' },
      { word: '～せいで', kana: '～せいで', meaning: 'chỉ tại vì, do... (kết quả xấu)' },
      { word: '注意する', kana: 'ちゅういする', meaning: 'nhắc nhở, cảnh cáo' },
      { word: '断る', kana: 'ことわる', meaning: 'từ chối' },
      { word: '～に決まっている', kana: '～にきまっている', meaning: 'chắc chắn là..., nhất định là...' },
      { word: '～ばよかった', kana: '～ばよかった', meaning: 'giá mà... thì tốt biết mấy (hối tiếc)' }
    ]
  },
  {
    id: 'listen_8_3',
    lesson: '第 8 課',
    code: 'Bài 8 - Nghe 3',
    title: 'Phàn nàn về quán trưởng & Nỗi vất vả dọn dẹp sảnh',
    jp_title: 'ホールの掃除と店長の小言',
    audio: 'audio/listening/bai_8_3.mp3',
    duration_label: '01:00',
    type: 'dialogue',
    summary: 'Anh Kobayashi tâm sự về việc bị quán trưởng mắng oan vì chưa kịp dọn dẹp sảnh giữa lúc quán đang quá đông khách.',
    lines: [
      {
        speaker: '小林',
        start: 0.0,
        end: 8.5,
        cloze: 'うーん。でも、{{この間|このあいだ|dạo gần đây, hôm nọ|2}}は僕も店長に{{怒られた|おこられた|bị mắng, bị tức giận|1}}よ。',
        vi: 'Ừm. Nhưng hôm nọ tôi cũng bị quản lý mắng té tát đấy.'
      },
      {
        speaker: '店員A',
        start: 8.6,
        end: 10.0,
        cloze: 'え、なんで？',
        vi: 'Ủa, sao vậy anh?'
      },
      {
        speaker: '小林',
        start: 10.1,
        end: 16.0,
        cloze: 'この間の金曜日、店が{{忙しくて|いそがしくて|bận rộn|2}}、いつもの時間に{{ホール|ホール|sảnh ăn, khu vực bàn ăn|1}}の{{掃除|そうじ|dọn dẹp vệ sinh|1}}ができなかったんだけど、',
        vi: 'Thứ Sáu vừa rồi quán bận quá, nên đến giờ thường lệ tôi không thể dọn dẹp sảnh ăn được,'
      },
      {
        speaker: '店員C',
        start: 16.1,
        end: 18.5,
        cloze: 'あー、忙しかったですよねー。',
        vi: 'A, hôm đó đông khách thật sự luôn ấy ạ.'
      },
      {
        speaker: '小林',
        start: 18.6,
        end: 27.0,
        cloze: 'そしたら店長に、「なんで掃除してないんだ」って怒られたんだ。こっちはこれから掃除しようって{{思ってたのに|おもってたのに|đang định... thế mà|1}}。',
        vi: 'Thế là quản lý mắng tôi: "Sao giờ này còn chưa dọn dẹp?". Mình đang định bụng đi dọn thì đã bị mắng rồi.'
      },
      {
        speaker: '店員A',
        start: 27.1,
        end: 30.0,
        cloze: 'ああ、それは小林さんの{{せいじゃない|せいじゃない|không phải lỗi do...|1}}よね。',
        vi: 'Ôi, thế thì đâu phải lỗi tại anh Kobayashi đâu.'
      },
      {
        speaker: '小林',
        start: 30.1,
        end: 41.0,
        cloze: 'だろう？注文を取りに行くのが遅くなれば、お客を{{イライラさせる|イライラさせる|làm cho bực mình, sốt ruột|1}}し、ホールの掃除が{{遅れれば|おくれれば|nếu bị muộn, chậm trễ|1}}、店長に怒られるし。たく、もう。',
        vi: 'Đúng không? Đi lấy đơn chậm thì khách bực dọc, mà dọn sảnh trễ thì lại bị quản lý mắng. Thiệt tình chứ.'
      },
      {
        speaker: '店員A',
        start: 41.1,
        end: 43.5,
        cloze: 'ほんと、大変だよね。',
        vi: 'Thật sự vất vả quá nhỉ.'
      },
      {
        speaker: '小林',
        start: 43.6,
        end: 52.5,
        cloze: 'いつも店が{{空いたら|すいたら|khi vắng khách|1}}ちゃんと掃除してるのに、店長、見てないんじゃないかなあ。{{見てないくせに|みてないくせに|đã không nhìn thấy mà lại...|1}}{{文句ばっかり|もんくばっかり|toàn cằn nhằn, kêu ca|1}}言って。',
        vi: 'Bình thường hễ quán vắng là mình dọn dẹp đàng hoàng ngay, chắc quản lý chẳng để mắt tới rồi. Đã không nhìn ngó gì mà lúc nào cũng chỉ biết cằn nhằn.'
      },
      {
        speaker: '店員A',
        start: 52.6,
        end: 56.0,
        cloze: 'まあ、{{飲もう|のもう|uống thôi|2}}！',
        vi: 'Thôi nào, cạn ly uống đi anh!'
      }
    ],
    vocab: [
      { word: 'ホール', kana: 'ホール', meaning: 'sảnh, khu vực bàn ăn trong nhà hàng' },
      { word: '掃除', kana: 'そうじ', meaning: 'dọn dẹp, vệ sinh' },
      { word: '怒る', kana: 'おこる', meaning: 'tức giận, mắng mỏ' },
      { word: 'イライラする', kana: 'イライラする', meaning: 'sốt ruột, bực mình' },
      { word: '遅れる', kana: 'おくれる', meaning: 'chậm trễ, muộn' },
      { word: '文句', kana: 'もんく', meaning: 'cằn nhằn, phàn nàn, kêu ca' },
      { word: '～ばっかり', kana: '～ばっかり', meaning: 'toàn là..., suốt ngày chỉ...' },
      { word: '空く', kana: 'すく', meaning: 'trống, vắng người' }
    ]
  },
  {
    id: 'listen_8_4',
    lesson: '第 8 課',
    code: 'Bài 8 - Nghe 4',
    title: 'Lý do nên bày tỏ tình cảm trực tiếp thay vì qua tin nhắn',
    jp_title: '気持ちを直接伝える理由',
    audio: 'audio/listening/bai_8_4.mp3',
    duration_label: '01:01',
    type: 'monologue',
    summary: 'Bài chia sẻ về lý do vì sao khi thổ lộ tình cảm nên gặp mặt trực tiếp: để thấu hiểu cảm xúc đối phương và tránh hối hận nếu để lại tin nhắn hay dấu vết.',
    lines: [
      {
        start: 0.0,
        end: 7.0,
        cloze: '私は、人に好きだという気持ちを{{伝えるときには|つたえるときには|khi bày tỏ, truyền đạt|1}}、その人に会って{{直接|ちょくせつ|trực tiếp|1}}言います。',
        vi: 'Khi muốn thổ lộ tình cảm thích một người nào đó, tôi luôn gặp mặt người ấy và nói trực tiếp.'
      },
      {
        start: 7.1,
        end: 12.0,
        cloze: '顔を見て伝えると、相手の{{様子|ようす|nét mặt, dáng vẻ, tình trạng|1}}がよくわかるからです。',
        vi: 'Bởi vì khi nhìn thẳng vào khuôn mặt để bày tỏ, mình sẽ thấu hiểu rất rõ nét mặt và cảm xúc của đối phương.'
      },
      {
        start: 12.1,
        end: 26.0,
        cloze: '確かに、直接言うのはとても{{緊張|きんちょう|căng thẳng, hồi hộp|1}}しますが、電話では顔が見えないし、メールや{{手紙|てがみ|thư tay|2}}では{{声|こえ|giọng nói|2}}も聞こえないので、相手の{{本当の気持ち|ほんとうのきもち|cảm xúc thật sự|1}}が{{わかりにくい|わかりにくい|khó hiểu, khó nhận ra|1}}と思います。',
        vi: 'Đúng là nói trực tiếp thì vô cùng hồi hộp căng thẳng, nhưng qua điện thoại thì không thấy được gương mặt, còn qua tin nhắn hay thư từ thì chẳng nghe được giọng nói, nên rất khó để nhận biết được cảm xúc thật của đối phương.'
      },
      {
        start: 26.1,
        end: 31.0,
        cloze: 'それから、もう一つの理由は、{{記録|きろく|ghi chép, dấu vết lưu lại|1}}に{{残したくない|のこしたくない|không muốn để lại|1}}からです。',
        vi: 'Ngoài ra, một lý do nữa là vì tôi không muốn để lại dấu vết bằng chữ.'
      },
      {
        start: 31.1,
        end: 37.5,
        cloze: 'もし、メールや手紙で伝えたら、相手のところに記録が{{残ってしまいます|のこってしまいます|bị lưu lại mất|1}}。',
        vi: 'Nếu bày tỏ qua email hay thư tay thì dấu vết ấy sẽ lưu lại bên phía người ta.'
      },
      {
        start: 37.6,
        end: 46.5,
        cloze: '返事がノーの場合には、相手のことを{{思い出すたびに|おもいだすたびに|cứ mỗi lần nhớ lại...|1}}、その記録が{{消えたかどうか|きえたかどうか|liệu đã bị xóa chưa|1}}{{気になる|きになる|bận tâm, lo lắng|1}}と思います。',
        vi: 'Trong trường hợp bị từ chối, cứ mỗi lần nhớ đến người đó, ta sẽ lại bận tâm lo lắng không biết tin nhắn ấy đã bị xóa đi hay chưa.'
      },
      {
        start: 46.6,
        end: 60.0,
        cloze: '会って{{伝えればよかったのに|つたえればよかったのに|giá mà gặp trực tiếp nói thì tốt thế mà...|1}}、どうしてメールにしちゃったんだろうと、{{後悔しないために|こうかいしないために|để không phải hối hận|1}}、直接言うのがいいと思います。',
        vi: 'Để không phải tự dằn vặt hối tiếc rằng "Giá mà mình gặp mặt nói cho xong, cớ sao lại gửi tin nhắn làm gì", tôi nghĩ gặp nói trực tiếp vẫn là tốt nhất.'
      }
    ],
    vocab: [
      { word: '直接', kana: 'ちょくせつ', meaning: 'trực tiếp' },
      { word: '伝える', kana: 'つたえる', meaning: 'truyền đạt, thổ lộ, bày tỏ' },
      { word: '様子', kana: 'ようす', meaning: 'dáng vẻ, tình trạng, sắc thái' },
      { word: '記録', kana: 'きろく', meaning: 'ghi chép, hồ sơ, dấu vết lưu lại' },
      { word: '残る', kana: 'のこる', meaning: 'còn lại, lưu lại' },
      { word: '～たびに', kana: '～たびに', meaning: 'mỗi lần... lại...' },
      { word: '後悔する', kana: 'こうかいする', meaning: 'hối hận, tiếc nuối' },
      { word: '気になる', kana: 'きになる', meaning: 'bận tâm, bồn chồn lo nghĩ' }
    ]
  },
// ==========================================================================
  // BÀI 9 (第 9 課) - NGHE HIỂU (5 BÀI NGHE)
  // ==========================================================================
  {
    id: 'listen_9_1',
    lesson: '第 9 課',
    code: 'Bài 9 - Nghe 1',
    title: 'Chơi chữ số Goroawase: Ngày của thịt (29日 = 肉の日)',
    jp_title: '語呂合わせ：29日の「肉の日」と「焼肉の日」',
    audio: 'audio/listening/bai_9_1.mp3',
    duration_label: '01:23',
    type: 'dialogue',
    summary: 'Thông báo siêu thị nhân ngày 29 (Ngày của thịt) và cuộc trò chuyện của hai bạn nữ về nguồn gốc cách chơi chữ số (語呂合わせ Goroawase) trong tiếng Nhật.',
    lines: [
      {
        speaker: '店内のアナウンス',
        start: 0.0,
        end: 18.5,
        cloze: '皆様、{{毎度|まいど|mỗi lần, thường lệ|1}}ご{{来店|らいてん|đến cửa hàng|1}}ありがとうございます。本日は29日、{{肉の日|にくのひ|ngày của thịt|1}}でございます。{{豚肉|ぶたにく|thịt lợn|1}}、{{牛肉|ぎゅうにく|thịt bò|1}}、{{鶏肉|とりにく|thịt gà|1}}、すべての肉が大変{{お安くなっております|おやすくなっております|được bán rất rẻ|2}}。皆様、どうぞご利用くださいませ。',
        vi: 'Kính thưa quý khách, xin chân thành cảm ơn quý khách đã luôn ghé thăm cửa hàng. Hôm nay là ngày 29, Ngày của thịt. Thịt lợn, thịt bò, thịt gà, tất cả các loại thịt đều được giảm giá vô cùng rẻ. Kính mời quý khách mua sắm.'
      },
      {
        speaker: '女性A',
        start: 18.6,
        end: 25.5,
        cloze: 'わあ、今日は肉の日だから、肉が安いんだ。今日のご飯は{{焼肉|やきにく|thịt nướng|1}}にしない？',
        vi: 'Oa, hôm nay là ngày của thịt nên thịt rẻ ghê. Bữa cơm tối nay tụi mình ăn thịt nướng đi?'
      },
      {
        speaker: '女性B',
        start: 25.6,
        end: 34.0,
        cloze: 'いいねー！じゃあ、たくさん{{買って帰ろう|かってかえろう|mua mang về nào|2}}！ねえ、でも何で今日は肉の日なの？',
        vi: 'Được đấy! Vậy mua thật nhiều mang về đi! Nè, mà sao hôm nay lại là Ngày của thịt thế?'
      },
      {
        speaker: '女性A',
        start: 34.1,
        end: 38.5,
        cloze: 'あ、それはね、29日だからだよ。',
        vi: 'A, cái đó là vì hôm nay là ngày 29 đấy.'
      },
      {
        speaker: '女性B',
        start: 38.6,
        end: 41.5,
        cloze: 'え？',
        vi: 'Hả?'
      },
      {
        speaker: '女性A',
        start: 41.6,
        end: 48.0,
        cloze: 'ほら、「2」と「9」で「肉」って{{読める|よめる|có thể đọc|1}}でしょ？',
        vi: 'Này nhé, số 2 và số 9 có thể đọc ghép lại thành "Niku" (thịt) đúng không nào?'
      },
      {
        speaker: '女性B',
        start: 48.1,
        end: 57.0,
        cloze: 'へえー、それで肉の日になったっていう{{わけ|わけ|lý do, hóa ra là|1}}？面白いねー！',
        vi: 'Ồ, hóa ra vì thế mà thành Ngày của thịt à? Thú vị ghê ha!'
      },
      {
        speaker: '女性A',
        start: 57.1,
        end: 68.0,
        cloze: 'そうそう。あ、そうだ！8月29日は「{{焼肉の日|やきにくのひ|ngày thịt nướng|1}}」っていうポスターを{{見たこともある|みたこともある|cũng từng thấy|2}}よ。',
        vi: 'Đúng rồi. A, phải rồi! Mình còn từng thấy áp phích ghi ngày 29 tháng 8 là "Ngày thịt nướng" nữa cơ.'
      },
      {
        speaker: '女性B',
        start: 68.1,
        end: 73.5,
        cloze: 'あ、わかった！「8」は「{{8つ|やっつ|tám cái|1}}」だから……',
        vi: 'A, mình hiểu rồi! Số 8 đọc là "Yattsu" nên...'
      },
      {
        speaker: '女性A',
        start: 73.6,
        end: 78.5,
        cloze: 'ピンポーン！{{正解|せいかい|chính xác|1}}！8つの「や」と「肉」で……',
        vi: 'Bing-bong! Chuẩn luôn! Số 8 là "Ya" kết hợp với "Niku" (29) thành...'
      },
      {
        speaker: '二人',
        start: 78.6,
        end: 83.0,
        cloze: '焼肉！面白ーい！',
        vi: 'Yakiniku (Thịt nướng)! Thú vị thật đấy!'
      }
    ],
    vocabulary: [
      { word: '語呂合わせ', kana: 'ごろあわせ', meaning: 'lối chơi chữ ghép âm từ các con số hoặc từ đồng âm' },
      { word: '肉の日', kana: 'にくのひ', meaning: 'ngày của thịt (ngày 29 hàng tháng)' },
      { word: '焼肉の日', kana: 'やきにくのひ', meaning: 'ngày thịt nướng (ngày 29 tháng 8)' },
      { word: '毎度', kana: 'まいど', meaning: 'mỗi lần, thường lệ' },
      { word: '来店', kana: 'らいてん', meaning: 'đến cửa hàng, ghé quán' },
      { word: '正解', kana: 'せいかい', meaning: 'câu trả lời chính xác, chuẩn xác' },
      { word: '～っていうわけ', kana: '～っていうわけ', meaning: 'thì ra là vì lý do...' }
    ]
  },
  {
    id: 'listen_9_2',
    lesson: '第 9 課',
    code: 'Bài 9 - Nghe 2',
    title: 'Nhầm lẫn thành ngữ: 顔が広い (quen rộng) & 顔が大きい (mặt to)',
    jp_title: '慣用句の誤用：顔が広いと顔が大きい',
    audio: 'audio/listening/bai_9_2.mp3',
    duration_label: '01:14',
    type: 'monologue',
    summary: 'Đoạn văn kể về sự cố dở khóc dở cười khi bạn học tiếng Nhật dùng nhầm thành ngữ "mặt to" thay vì "quen biết rộng", khiến người nghe ngỡ ngàng suýt giận.',
    lines: [
      {
        speaker: '話し手',
        start: 0.0,
        end: 11.5,
        cloze: '私は学校で{{習った|ならった|đã học|1}}表現をすぐに使ってみたくなります。でも、よく使い方を{{間違えて|まちがえて|nhầm lẫn|1}}失敗します。',
        vi: 'Tôi cứ hễ học được cách diễn đạt nào ở trường là lại muốn dùng thử ngay. Nhưng tôi hay dùng nhầm cách nên thất bại.'
      },
      {
        speaker: '話し手',
        start: 11.6,
        end: 24.5,
        cloze: '実は昨日も、学校で習った「{{顔が広い|かおがひろい|quen biết rộng|1}}」と「{{顔が大きい|かおがおおきい|mặt to|1}}」を間違えて、{{顔から火が出る|かおからひがでる|xấu hổ bốc hỏa|2}}ほど恥ずかしい経験をしました。',
        vi: 'Thực ra hôm qua cũng vậy, tôi đã nhầm giữa "mặt rộng" (quen biết rộng) và "mặt to", tạo nên một trải nghiệm ngượng chín cả mặt.'
      },
      {
        speaker: '話し手',
        start: 24.6,
        end: 37.0,
        cloze: '日本では「顔が大きい」は{{失礼|しつれい|thất lễ, bất lịch sự|1}}な表現です。それなのに昨日、いつも{{お世話になっている|おせわになっている|được giúp đỡ, chăm sóc|1}}方に、「お顔が大きいですね」と言ってしまいました。',
        vi: 'Ở Nhật, "mặt to" là một cách nói rất thất lễ. Ấy thế mà hôm qua, với người luôn chăm sóc giúp đỡ tôi, tôi lại lỡ miệng bảo: "Bác có khuôn mặt to thật đấy ạ".'
      },
      {
        speaker: '話し手',
        start: 37.1,
        end: 47.0,
        cloze: '私の言葉を聞いて、その方は{{驚いた|おどろいた|kinh ngạc, giật mình|1}}顔をして黙ってしまいました。私はすぐに気がついて、{{必死|ひっし|hết sức, cuống cuồng|1}}で説明しました。',
        vi: 'Nghe câu nói của tôi, người ấy lộ vẻ kinh ngạc rồi im bặt. Tôi lập tức nhận ra và cuống cuồng giải thích.'
      },
      {
        speaker: '話し手',
        start: 47.1,
        end: 59.5,
        cloze: 'その方はすぐに、あははと笑ってくれましたが、{{もう少しで|もうすこしで|suýt chút nữa|1}}{{怒らせてしまう|おこらせてしまう|khiến người khác tức giận|2}}ところでした。本当に恥ずかしくて{{たまりませんでした|たまりませんでした|không chịu nổi|1}}。',
        vi: 'Người ấy liền cười xòa "Ahaha", nhưng suýt chút nữa là tôi đã làm bác ấy nổi giận rồi. Thật sự xấu hổ không để đâu cho hết.'
      },
      {
        speaker: '話し手',
        start: 59.6,
        end: 74.0,
        cloze: 'これからは{{気をつけなければ|きをつけなければ|phải cẩn thận|2}}と思いました。日本語を使うのは難しいですが、これからもいろいろな表現を使ってみたいと思っています。',
        vi: 'Tôi nghĩ từ nay mình phải cẩn thận hơn. Sử dụng tiếng Nhật tuy khó, nhưng từ giờ tôi vẫn muốn tiếp tục vận dụng nhiều cách diễn đạt phong phú.'
      }
    ],
    vocabulary: [
      { word: '顔が広い', kana: 'かおがひろい', meaning: 'quen biết rộng, giao thiệp rộng rãi' },
      { word: '顔から火が出る', kana: 'かおからひがでる', meaning: 'ngượng chín cả mặt, xấu hổ bốc hỏa' },
      { word: '失礼な', kana: 'しつれいな', meaning: 'thất lễ, bất lịch sự' },
      { word: 'お世話になる', kana: 'おせわになる', meaning: 'được nhận sự giúp đỡ, chăm sóc' },
      { word: '必死で', kana: 'ひっしで', meaning: 'liều mạng, cuống cuồng, dốc hết sức' },
      { word: '怒らせる', kana: 'おこらせる', meaning: 'khiến cho ai đó tức giận (sai khiến)' },
      { word: '～てたまらない', kana: '～てたまらない', meaning: 'vô cùng... không chịu nổi' },
      { word: 'もう少しで～ところだった', kana: 'もうすこしで～ところだった', meaning: 'suýt chút nữa thì...' }
    ]
  },
  {
    id: 'listen_9_3',
    lesson: '第 9 課',
    code: 'Bài 9 - Nghe 3',
    title: 'Ngôn ngữ giới tính (男言葉・女言葉) & Cách xưng hô nơi làm thêm',
    jp_title: '男言葉と女言葉・アルバイト先での言葉遣い',
    audio: 'audio/listening/bai_9_3.mp3',
    duration_label: '01:42',
    type: 'dialogue',
    summary: 'Cuộc thảo luận giữa học viên và thầy giáo về ngôn ngữ nam nữ, cách nói chuyện của nữ sinh cấp ba, và việc xưng hô "watashi" hay "boku" với tiền bối khi đi làm thêm.',
    lines: [
      {
        speaker: '留学生（女）',
        start: 0.0,
        end: 18.0,
        cloze: '先生、日本語には{{男言葉|おとこことば|ngôn ngữ nam giới|1}}と{{女言葉|おんなことば|ngôn ngữ nữ giới|1}}がありますよね。私は日本の女の人の話し方が{{優しくて|やさしくて|dịu dàng, hiền từ|1}}好きなんですけど、電車の中とかで聞く{{女子高生|じょしこうせい|nữ sinh cấp ba|1}}の言葉って、ちょっと男の子みたいですね。',
        vi: 'Thầy ơi, trong tiếng Nhật có ngôn ngữ nam và ngôn ngữ nữ đúng không ạ. Em rất thích cách nói chuyện dịu dàng của phụ nữ Nhật, thế nhưng lời ăn tiếng nói của các bạn nữ sinh cấp ba nghe trên tàu điện lại hơi giống con trai ấy ạ.'
      },
      {
        speaker: '先生',
        start: 18.1,
        end: 31.0,
        cloze: 'そうですね。最近は男女の{{言葉遣い|ことばづかい|cách dùng từ, cách ăn nói|1}}の{{違いがなくなってきています|ちがいがなくなってきています|sự khác biệt đang dần biến mất|2}}ね。でも、その高校生たちも、いつも男の子みたいな話し方をしているわけではないと思いますよ。',
        vi: 'Đúng vậy nhỉ. Gần đây sự khác biệt về cách ăn nói giữa nam và nữ đang dần biến mất. Nhưng tôi nghĩ những học sinh cấp ba đó không phải lúc nào cũng nói chuyện giống con trai đâu.'
      },
      {
        speaker: '留学生（女）',
        start: 31.1,
        end: 33.5,
        cloze: 'そうなんですか。',
        vi: 'Thế ạ?'
      },
      {
        speaker: '先生',
        start: 33.6,
        end: 40.5,
        cloze: '{{目上の人|めうえのひと|người trên, bậc bề trên|1}}や、あまり親しくない人には、{{丁寧に|ていねいに|lịch sự|1}}話していると思いますよ。',
        vi: 'Với người bề trên hoặc người không thân thiết lắm, tôi nghĩ các bạn ấy vẫn nói chuyện rất lịch sự đấy.'
      },
      {
        speaker: '留学生（男）',
        start: 40.6,
        end: 64.5,
        cloze: 'ああ、私の{{バイト先|バイトさき|chỗ làm thêm|1}}でも、みんな店長には丁寧な言葉で話してますね。私も、店長や先輩には丁寧に話そうと思って、自分のことを「{{私|わたし|tôi (lịch sự)|1}}」って言ってたんです。でも、この間先輩から、「僕たちと話す時には、自分のことを私って言わなくていいよ」って言われたんです。',
        vi: 'A, ở chỗ làm thêm của em cũng vậy, mọi người đều nói chuyện với cửa hàng trưởng bằng lời lẽ lịch sự. Em cũng nghĩ phải nói lịch sự với cửa hàng trưởng và các tiền bối nên xưng bản thân là "Watashi". Thế nhưng dạo trước tiền bối lại bảo em: "Khi nói chuyện với bọn anh thì không cần phải xưng là watashi đâu".'
      },
      {
        speaker: '先生',
        start: 64.6,
        end: 81.0,
        cloze: '確かに、会社なんかでは「私」を使ったほうがいいですけど、アルバイト先の先輩がそう言うんだったら、「私」は使わないほうがもっと{{親しくなれる|したしくなれる|trở nên thân thiết hơn|1}}かもしれませんね。',
        vi: 'Đúng là ở công ty thì nên dùng "Watashi", nhưng nếu tiền bối ở chỗ làm thêm đã nói như vậy thì có lẽ không dùng "Watashi" sẽ giúp các em trở nên thân thiết hơn đấy.'
      },
      {
        speaker: '留学生（男）',
        start: 81.1,
        end: 84.5,
        cloze: 'へえー、難しいですね。',
        vi: 'Oa, khó thật đấy thầy nhỉ.'
      },
      {
        speaker: '先生',
        start: 84.6,
        end: 102.0,
        cloze: 'そうですね。意味の違いぐらいはすぐに覚えられても、{{状況に合わせて|じょうきょうにあわせて|phù hợp với hoàn cảnh|2}}その言葉を{{使い分ける|つかいわける|dùng phân biệt đúng ngữ cảnh|2}}のは難しいかもしれませんね。でも、それがまた日本語の面白いところだと思いますよ。',
        vi: 'Đúng vậy. Dù phân biệt ý nghĩa thì có thể nhớ ngay, nhưng để dùng linh hoạt đúng hoàn cảnh thì có lẽ khá khó. Thế nhưng tôi nghĩ đó cũng chính là điểm thú vị của tiếng Nhật đấy.'
      }
    ],
    vocabulary: [
      { word: '男言葉', kana: 'おとこことば', meaning: 'từ ngữ/cách nói của nam giới' },
      { word: '女言葉', kana: 'おんなことば', meaning: 'từ ngữ/cách nói của nữ giới' },
      { word: '言葉遣い', kana: 'ことばづかい', meaning: 'cách ăn nói, cách dùng từ ngữ' },
      { word: '目上の人', kana: 'めうえのひと', meaning: 'người bề trên, cấp trên' },
      { word: 'バイト先', kana: 'バイトさき', meaning: 'nơi làm thêm, chỗ làm thêm' },
      { word: '親しくなる', kana: 'したしくなる', meaning: 'trở nên thân thiết, gần gũi' },
      { word: '使い分ける', kana: 'つかいわける', meaning: 'dùng phân biệt linh hoạt tùy hoàn cảnh' },
      { word: '状況に合わせて', kana: 'じょうきょうにあわせて', meaning: 'phù hợp với tình huống/ngữ cảnh' }
    ]
  },
  {
    id: 'listen_9_4',
    lesson: '第 9 課',
    code: 'Bài 9 - Nghe 4',
    title: 'Sự biến đổi ngữ nghĩa: Từ lóng ヤバい & Phó từ 全然',
    jp_title: '言葉の意味変化：「ヤバい」と「全然」',
    audio: 'audio/listening/bai_9_4.mp3',
    duration_label: '01:27',
    type: 'dialogue',
    summary: 'Thầy giáo giảng giải về hiện tượng biến đổi ngữ nghĩa của từ lóng "ヤバい" từ tiêu cực sang khen ngợi ngon/ngầu, và cách dùng từ "全然" kèm ý nghĩa khẳng định.',
    lines: [
      {
        speaker: '学生（男）',
        start: 0.0,
        end: 11.5,
        cloze: '先生、昨日テレビで女の人が{{美味しそうに|おいしそうに|trông có vẻ rất ngon|2}}何か食べながら「{{ヤバい|ヤバい|nguy hiểm / quá đỉnh|1}}」って言ったんですけど、どういう意味ですか？',
        vi: 'Thầy ơi, hôm qua trên TV em thấy một người phụ nữ vừa ăn cái gì đó trông ngon lành vừa thốt lên "Yabai!", từ đó có nghĩa là gì vậy ạ?'
      },
      {
        speaker: 'パーク',
        start: 11.6,
        end: 16.5,
        cloze: 'あ、それ知ってる！すごく美味しいって意味ですよね。',
        vi: 'A, cái đó em biết nè! Nghĩa là cực kỳ ngon đúng không thầy?'
      },
      {
        speaker: '先生',
        start: 16.6,
        end: 19.5,
        cloze: 'パークさん、よく知ってますね。',
        vi: 'Park biết rõ ghê nhỉ.'
      },
      {
        speaker: 'パーク',
        start: 19.6,
        end: 24.5,
        cloze: 'バイト先のお客さんが時々言ってますから。',
        vi: 'Dạ tại vì khách ở chỗ làm thêm của em thỉnh thoảng hay nói vậy ạ.'
      },
      {
        speaker: '先生',
        start: 24.6,
        end: 47.0,
        cloze: '「ヤバい」というのは、元は「{{危ない|あぶない|nguy hiểm|1}}」という意味だったんですよ。それが「{{都合が悪い|つごうがわるい|bất lợi, không tiện|1}}」というような時にも使うようになったんですね。最初は{{マイナスのイメージ|マイナスのイメージ|ấn tượng tiêu cực|1}}だったのが、最近ではいい意味でも使われるようになってきたんです。すごく美味しいとか、{{かっこいい|かっこいい|ngầu, bảnh bao|1}}とか。',
        vi: '"Yabai" vốn dĩ ban đầu có nghĩa là "nguy hiểm". Sau đó người ta bắt đầu dùng nó trong những lúc "bất lợi, phiền phức". Ban đầu mang ấn tượng tiêu cực, nhưng gần đây nó còn được dùng với ý khen ngợi tích cực nữa. Chẳng hạn như cực kỳ ngon, hay là rất ngầu.'
      },
      {
        speaker: '学生（男）',
        start: 47.1,
        end: 50.5,
        cloze: '{{若い人|わかいひと|người trẻ|1}}が使う言葉ですか？',
        vi: 'Đó là từ mà giới trẻ hay dùng ạ?'
      },
      {
        speaker: '先生',
        start: 50.6,
        end: 61.5,
        cloze: '今はそうですが、だんだん多くの人が使うようになるかもしれませんね。言葉は{{使われている間に|つかわれているあいだに|trong quá trình được sử dụng|2}}{{変わっていくもの|かわっていくもの|thứ sẽ biến đổi theo thời gian|2}}ですから。',
        vi: 'Bây giờ thì là vậy, nhưng có lẽ dần dà sẽ có nhiều người dùng hơn. Bởi vì ngôn ngữ vốn biến đổi trong quá trình được sử dụng mà.'
      },
      {
        speaker: '学生（男）',
        start: 61.6,
        end: 64.0,
        cloze: 'ふーん。',
        vi: 'Ồ ra vậy.'
      },
      {
        speaker: '先生',
        start: 64.1,
        end: 79.5,
        cloze: '例えば、「{{全然|ぜんぜん|hoàn toàn|1}}」という言葉は、「全然美味しくない」というように、後ろに{{否定|ひてい|phủ định|1}}の言葉がつくのが{{一般的|いっぱんてき|phổ biến, thông thường|1}}ですね。でも最近は、「全然いい」とか「全然美味しい」とか言う人も多くなりましたね。',
        vi: 'Chẳng hạn như từ "Zenzen", thông thường đằng sau nó sẽ đi kèm từ mang tính phủ định như "hoàn toàn không ngon". Thế nhưng gần đây người nói "hoàn toàn ổn / cực kỳ ngon" cũng trở nên nhiều hơn rồi.'
      },
      {
        speaker: '学生（男）',
        start: 79.6,
        end: 82.5,
        cloze: 'へえー、そうなんですか。',
        vi: 'Chà, ra là thế ạ.'
      },
      {
        speaker: 'パーク',
        start: 82.6,
        end: 87.0,
        cloze: '面白いですね。',
        vi: 'Thú vị thật đấy thầy ạ.'
      }
    ],
    vocabulary: [
      { word: 'ヤバい', kana: 'ヤバい', meaning: 'từ lóng: nguy hiểm, gay go; nghĩa mới: siêu ngon, cực ngầu, quá đỉnh' },
      { word: '都合が悪い', kana: 'つごうがわるい', meaning: 'bất tiện, bất lợi, không thuận tiện' },
      { word: 'マイナスのイメージ', kana: 'マイナスのイメージ', meaning: 'ấn tượng tiêu cực' },
      { word: 'かっこいい', kana: 'かっこいい', meaning: 'ngầu, bảnh bao, đẹp mắt' },
      { word: '全然', kana: 'ぜんぜん', meaning: 'hoàn toàn (truyền thống đi với phủ định; hiện đại dùng cả khẳng định)' },
      { word: '否定', kana: 'ひてい', meaning: 'phủ định' },
      { word: '一般的', kana: 'いっぱんてき', meaning: 'phổ biến, thông thường' },
      { word: '～ていくものだ', kana: '～ていくものだ', meaning: 'vốn dĩ tự nhiên sẽ biến chuyển...' }
    ]
  },
  {
    id: 'listen_9_5',
    lesson: '第 9 課',
    code: 'Bài 9 - Nghe 5',
    title: 'Mẹo nhớ số điện thoại qua chơi chữ (0120-508-315: これは最高)',
    jp_title: '電話番号の語呂合わせ「これは最高」',
    audio: 'audio/listening/bai_9_5.mp3',
    duration_label: '01:46',
    type: 'dialogue',
    summary: 'Đoạn quảng cáo và cuộc trao đổi vui về cách nhớ dãy số điện thoại đường dây nóng miễn phí (フリーダイヤル 0120-508-315) bằng cách ghép các chữ cái đầu thành câu "Đây là tuyệt nhất".',
    lines: [
      {
        speaker: 'TVコマーシャル',
        start: 0.0,
        end: 18.0,
        cloze: '軽くて{{便利|べんり|tiện lợi|2}}な{{革製|かわせい|làm bằng da|1}}のバッグです。ご注文は{{フリーダイヤル|フリーダイヤル|số điện thoại gọi miễn phí|1}} 0120-508-315。0120の「{{これは最高|これはさいこう|đây là tuyệt nhất|1}}」まで！お{{掛け間違い|かけまちがい|gọi nhầm số|1}}に{{ご注意ください|ごちゅういください|xin hãy chú ý|2}}。',
        vi: 'Túi xách da cao cấp vừa nhẹ vừa tiện lợi. Đặt hàng xin vui lòng gọi đến tổng đài miễn phí 0120-508-315. Đến số 0120 "Đây là tuyệt nhất"! Xin quý khách lưu ý tránh gọi nhầm số.'
      },
      {
        speaker: '男性',
        start: 18.1,
        end: 25.0,
        cloze: 'え？0120の「これは最高」？{{一体|いったい|rốt cuộc, rốt cục là|1}}何のこと？',
        vi: 'Hả? 0120 "Đây là tuyệt nhất"? Rốt cuộc là ý gì thế nhỉ?'
      },
      {
        speaker: '女性A',
        start: 25.1,
        end: 31.0,
        cloze: 'ああ、電話番号の「508の315」のことを言ってるんだよ。',
        vi: 'À, đang nói đến cụm 508-315 trong số điện thoại đấy.'
      },
      {
        speaker: '男性',
        start: 31.1,
        end: 33.5,
        cloze: 'え？どうして？',
        vi: 'Ơ? Sao lại thế?'
      },
      {
        speaker: '女性A',
        start: 33.6,
        end: 58.5,
        cloze: 'さっき、フリーダイヤルの番号を言ってたでしょ？0120の後の508の315の{{覚え方|おぼえかた|cách nhớ|1}}のことだよ。ここに{{数字|すうじ|chữ số|1}}を書くね。ほら、見て。この数字の508の「0」は「レイ」とも読むから、初めの文字を読むと「ご・れ・わ」になるでしょ？そこから「これは」になるんだよ。',
        vi: 'Lúc nãy vừa đọc số tổng đài miễn phí đấy thôi? Là mẹo nhớ cụm 508-315 sau đầu số 0120 đấy. Mình viết số ra đây nhé. Này xem đi, số 0 trong 508 này còn có thể đọc là "Rei", nên nếu đọc các ký tự đầu sẽ là "Go - Re - Wa" đúng không? Từ đó biến thành "Kore wa" (cái này) đấy.'
      },
      {
        speaker: '女性B',
        start: 58.6,
        end: 62.0,
        cloze: 'へえ、そうなんだ。',
        vi: 'Chà, ra là thế.'
      },
      {
        speaker: '男性',
        start: 62.1,
        end: 65.5,
        cloze: 'それで、後ろの数字何だっけ？',
        vi: 'Thế còn dãy số đằng sau là gì ấy nhỉ?'
      },
      {
        speaker: '女性A',
        start: 65.6,
        end: 68.0,
        cloze: '315だよ。',
        vi: 'Là 315.'
      },
      {
        speaker: '男性',
        start: 68.1,
        end: 71.0,
        cloze: 'さ・い・ご？',
        vi: 'Sa - i - go (Cuối cùng) à?'
      },
      {
        speaker: '女性A',
        start: 71.1,
        end: 89.0,
        cloze: '違う違う！「{{最後|さいご|cuối cùng|1}}」なんてイメージ悪くない？{{コマーシャル|コマーシャル|quảng cáo|1}}だから{{イメージ良くしないと|イメージよくしないと|phải làm cho hình ảnh đẹp|2}}。だから、「5」を「こ」って読んで、つまり「{{最高|さいこう|tuyệt vời nhất|1}}」になるっていうわけだよ。',
        vi: 'Không phải, không phải! Nghĩ ra "Saigo" (cuối cùng) chẳng phải ấn tượng xấu sao? Quảng cáo thì hình ảnh phải đẹp chứ. Cho nên số 5 đọc thành "Ko", tức là thành "Saikou" (tuyệt nhất) đấy.'
      },
      {
        speaker: '女性B',
        start: 89.1,
        end: 93.0,
        cloze: 'そっかー、面白いね！',
        vi: 'A ra vậy, thú vị thật đấy!'
      },
      {
        speaker: '女性A',
        start: 93.1,
        end: 106.0,
        cloze: '高校の時、いろんな数字を覚えることが多かったけど、数字を言葉にして覚えたら楽しかったし、{{覚えやすかった|おぼえやすかった|dễ nhớ|1}}よ。',
        vi: 'Hồi cấp ba mình phải học thuộc nhiều con số lắm, nhưng cứ biến các con số thành từ ngữ rồi nhớ thì vừa vui mà lại vừa dễ nhớ nữa.'
      }
    ],
    vocabulary: [
      { word: 'フリーダイヤル', kana: 'フリーダイヤル', meaning: 'đường dây nóng gọi miễn phí (toll-free)' },
      { word: '掛け間違い', kana: 'かけまちがい', meaning: 'gọi nhầm số điện thoại' },
      { word: '語呂合わせ', kana: 'ごろあわせ', meaning: 'nghệ thuật chơi chữ bằng cách ghép âm các con số' },
      { word: '一体', kana: 'いったい', meaning: 'rốt cuộc là, rốt cục là' },
      { word: 'コマーシャル', kana: 'コマーシャル', meaning: 'quảng cáo thương mại truyền hình (CM)' },
      { word: '最後', kana: 'さいご', meaning: 'cuối cùng' },
      { word: '最高', kana: 'さいこう', meaning: 'tuyệt vời nhất, đỉnh cao nhất' },
      { word: '覚えやすい', kana: 'おぼえやすい', meaning: 'dễ nhớ, dễ thuộc' }
    ]
  },
// ==========================================================================
  // BÀI 10 (第 10 課) - NGHE HIỂU (5 BÀI NGHE)
  // ==========================================================================
  {
    id: 'listen_10_1',
    lesson: '第 10 課',
    code: 'Bài 10 - Nghe 1',
    title: 'Để quên áo Cardigan tại nhà hàng & Nhờ gửi chuyển phát thu tiền hộ (着払い)',
    jp_title: 'レストランでの忘れ物と着払い宅配便',
    audio: 'audio/listening/bai_10_1.mp3',
    duration_label: '01:14',
    type: 'dialogue',
    summary: 'Khách hàng gọi điện cho nhà hàng Miyabi hỏi về chiếc áo cardigan màu xám để quên trên ghế, và nhờ quán gửi chuyển phát nhanh thu tiền người nhận (Chakubarai) vì đang trên tàu Shinkansen về.',
    lines: [
      {
        speaker: '店員',
        start: 2.0,
        end: 4.5,
        cloze: 'はい、レストラン{{雅|みやび|Miyabi (tên nhà hàng)|1}}です。',
        vi: 'Vâng, nhà hàng Miyabi xin nghe ạ.'
      },
      {
        speaker: '客（女性）',
        start: 4.6,
        end: 9.5,
        cloze: 'もしもし？今日のお昼にそちらで{{食事をした|しょくじをした|đã dùng bữa|1}}ものなんですが。',
        vi: 'Alo? Tôi là người đã dùng bữa trưa ở bên mình hôm nay ạ.'
      },
      {
        speaker: '店員',
        start: 9.6,
        end: 10.5,
        cloze: 'はい。',
        vi: 'Vâng.'
      },
      {
        speaker: '客（女性）',
        start: 10.6,
        end: 18.0,
        cloze: 'そちらに{{カーディガン|カーディガン|áo khoác len cardigan|1}}を{{忘れてしまった|わすれてしまった|lỡ để quên|1}}ようなんです。カバンに{{入れたつもり|いれたつもり|ngỡ là đã cho vào|2}}だったんですが、なかったもので。',
        vi: 'Hình như tôi đã để quên chiếc áo cardigan ở chỗ bạn. Tôi cứ ngỡ là mình đã cất vào túi rồi, thế mà tìm lại không thấy đâu cả.'
      },
      {
        speaker: '店員',
        start: 18.1,
        end: 21.0,
        cloze: 'そうですか。どんなカーディガンですか？',
        vi: 'Vậy ạ. Đó là chiếc áo cardigan như thế nào ạ?'
      },
      {
        speaker: '客（女性）',
        start: 21.1,
        end: 26.0,
        cloze: '色は{{グレー|グレー|màu xám|1}}で、胸のところにペンギンの{{マーク|マーク|hình biểu tượng/logo|1}}が{{付いている|ついている|có đính kèm, gắn trên|1}}んです。',
        vi: 'Áo màu xám, ở phần ngực áo có đính biểu tượng chim cánh cụt ạ.'
      },
      {
        speaker: '店員',
        start: 26.1,
        end: 28.5,
        cloze: 'どの{{辺り|あたり|khu vực, khoảng|1}}に{{座っていらっしゃいましたか|すわっていらっしゃいましたか|đã ngồi (kính ngữ)|2}}？',
        vi: 'Quý khách đã ngồi ở khu vực nào vậy ạ?'
      },
      {
        speaker: '客（女性）',
        start: 28.6,
        end: 37.0,
        cloze: '{{窓側|まどがわ|phía cửa sổ|1}}の{{奥の席|おくのせき|ghế bên trong sâu|1}}です。椅子に{{かけたように思う|かけたようにおもう|nghĩ là dường như đã vắt trên|2}}んですが、もしかしたら{{下に落ちている|したにおちている|rơi xuống dưới|1}}かもしれません。',
        vi: 'Bàn phía trong cùng bên cạnh cửa sổ ạ. Tôi nhớ hình như mình có vắt trên ghế, nhưng cũng có thể nó đã bị rơi xuống gầm ghế.'
      },
      {
        speaker: '店員',
        start: 37.1,
        end: 40.5,
        cloze: '分かりました。{{少々お待ちください|しょうしょうおまちください|xin vui lòng đợi trong giây lát|2}}。',
        vi: 'Tôi hiểu rồi. Xin quý khách vui lòng đợi trong giây lát ạ.'
      },
      {
        speaker: '店員',
        start: 45.0,
        end: 48.0,
        cloze: '{{お待たせいたしました|おまたせいたしました|xin lỗi đã để quý khách đợi lâu|2}}。こちらにございます。',
        vi: 'Xin lỗi đã để quý khách đợi lâu. Chiếc áo đang ở chỗ chúng tôi đây rồi ạ.'
      },
      {
        speaker: '客（女性）',
        start: 48.1,
        end: 50.0,
        cloze: 'ああ、よかったです！',
        vi: 'Ôi may quá!'
      },
      {
        speaker: '店員',
        start: 50.1,
        end: 52.0,
        cloze: 'どうしましょうか？',
        vi: 'Bên tôi nên gửi lại quý khách bằng cách nào đây ạ?'
      },
      {
        speaker: '客（女性）',
        start: 52.1,
        end: 57.5,
        cloze: 'あ、実はそちらには{{旅行|りょこう|du lịch|1}}で行って、今は帰りの{{新幹線|しんかんせん|tàu siêu tốc Shinkansen|1}}の中なんです。',
        vi: 'À, thực ra tôi đi du lịch đến đấy, giờ thì tôi đang trên chuyến tàu Shinkansen chiều về rồi ạ.'
      },
      {
        speaker: '店員',
        start: 57.6,
        end: 59.5,
        cloze: 'ああ、そうなんですか。',
        vi: 'À, ra là vậy ạ.'
      },
      {
        speaker: '客（女性）',
        start: 59.6,
        end: 65.0,
        cloze: 'すみませんが、{{着払い|ちゃくばらい|người nhận trả tiền cước|1}}の{{宅配便|たくはいびん|dịch vụ chuyển phát tận nhà|1}}で{{送ってもらってもいいですか|おくってもらってもいいですか|gửi giúp tôi có được không|2}}？',
        vi: 'Làm phiền bạn có thể gửi dịch vụ chuyển phát nhanh người nhận thanh toán cước giúp tôi được không ạ?'
      },
      {
        speaker: '店員',
        start: 65.1,
        end: 70.0,
        cloze: 'はい、分かりました。では、お名前とご{{住所|じゅうしょ|địa chỉ|1}}を……',
        vi: 'Vâng, được chứ ạ. Vậy xin quý khách cho biết họ tên và địa chỉ...'
      }
    ],
    vocabulary: [
      { word: 'カーディガン', kana: 'カーディガン', meaning: 'áo khoác len cài cúc / áo cardigan' },
      { word: '～たつもり', kana: '～たつもり', meaning: 'cứ ngỡ là, tưởng là đã...' },
      { word: '～ように思う', kana: '～ようにおもう', meaning: 'cảm thấy như là, dường như là...' },
      { word: '着払い', kana: 'ちゃくばらい', meaning: 'thanh toán cước khi nhận hàng (người nhận trả tiền ship)' },
      { word: '宅配便', kana: 'たくはいびん', meaning: 'dịch vụ chuyển phát nhanh hàng hóa tận nhà' },
      { word: '窓側', kana: 'まどがわ', meaning: 'phía cửa sổ' },
      { word: '奥の席', kana: 'おくのせき', meaning: 'ghế ngồi phía trong sâu' },
      { word: 'マークが付いている', kana: 'マークがついている', meaning: 'có gắn hình biểu tượng/logo' }
    ]
  },
  {
    id: 'listen_10_2',
    lesson: '第 10 課',
    code: 'Bài 10 - Nghe 2',
    title: 'Thông báo trên tàu tốc hành Sunshine Liner 3 & Quy định toa xe',
    jp_title: '特急列車「サンシャインライナー3号」の車内放送',
    audio: 'audio/listening/bai_10_2.mp3',
    duration_label: '01:40',
    type: 'monologue',
    summary: 'Phát thanh hướng dẫn hành khách trên tàu đặc cấp Sunshine Liner 3 đi Midorigahama: phân chia toa tự do/toa chỉ định/toa Green, bán hàng lưu động, giờ tàu đến ga và lưu ý hút thuốc/điện thoại.',
    lines: [
      {
        speaker: '車内アナウンス',
        start: 7.0,
        end: 12.0,
        cloze: '本日も、燕鉄道をご{{利用くださいまして|りようくださいまして|sử dụng dịch vụ (kính ngữ)|2}}、ありがとうございます。',
        vi: 'Cảm ơn quý khách hôm nay cũng đã lựa chọn và sử dụng dịch vụ của đường sắt Tsubame.'
      },
      {
        speaker: '車内アナウンス',
        start: 12.1,
        end: 19.5,
        cloze: 'この列車は、{{特別急行|とくべつきゅうこう|tàu tốc hành đặc biệt (tokkyuu)|1}}「サンシャインライナー3号」、緑が浜{{行き|ゆき|đi đến (hướng đi)|1}}です。',
        vi: 'Chuyến tàu này là tàu tốc hành đặc biệt "Sunshine Liner số 3", hướng đi Midorigahama.'
      },
      {
        speaker: '車内アナウンス',
        start: 19.6,
        end: 22.0,
        cloze: '{{車内のご案内|しゃないのごあんない|hướng dẫn trên tàu|1}}をいたします。',
        vi: 'Sau đây tôi xin phép hướng dẫn thông tin trong khoang tàu.'
      },
      {
        speaker: '車内アナウンス',
        start: 22.1,
        end: 31.0,
        cloze: '{{自由席|じゆうせき|ghế tự do|1}}は、1号車から3号車まで。4号車から7号車までが{{座席指定車|ざせきしていしゃ|toa ghế đặt trước/chỉ định|1}}{{となっております|となっております|đang là, được quy định là|2}}。',
        vi: 'Ghế tự do là từ toa số 1 đến toa số 3. Toa số 4 đến toa số 7 là các toa ghế đặt trước có chỉ định số ghế.'
      },
      {
        speaker: '車内アナウンス',
        start: 31.1,
        end: 36.0,
        cloze: 'そのうち、4号車は{{グリーン車|グリーンしゃ|toa hạng nhất (Green Car)|1}}の座席指定車です。',
        vi: 'Trong đó, toa số 4 là toa ghế chỉ định hạng nhất (Green Car).'
      },
      {
        speaker: '車内アナウンス',
        start: 36.1,
        end: 46.0,
        cloze: '{{終点|しゅうてん|ga cuối, trạm cuối|1}}、緑が浜まで、{{車内販売|しゃないはんばい|bán hàng trên tàu|1}}がございます。お弁当、お茶などを座席まで{{お持ちします|おもちします|mang đến (khiêm nhường)|2}}ので、どうぞご利用ください。',
        vi: 'Cho đến ga cuối Midorigahama sẽ có dịch vụ bán đồ ăn thức uống trên tàu. Nhân viên sẽ mang cơm hộp, trà phục vụ tận ghế, kính mời quý khách sử dụng.'
      },
      {
        speaker: '車内アナウンス',
        start: 46.1,
        end: 50.0,
        cloze: '{{停車駅|ていしゃえき|ga dừng đỗ|1}}と{{到着時刻|とうちゃくじこく|thời gian đến nơi|1}}をご案内いたします。',
        vi: 'Tiếp theo xin thông báo các ga dừng đỗ và thời gian đến nơi.'
      },
      {
        speaker: '車内アナウンス',
        start: 50.1,
        end: 64.0,
        cloze: '次の新港には10時{{ちょうど|ちょうど|đúng, tròn|1}}、未来ヶ丘10時35分、終点緑が浜には11時25分{{到着予定|とうちゃくよてい|dự kiến đến|1}}です。',
        vi: 'Ga tiếp theo Shin-minato sẽ là đúng 10 giờ, Miraigaoka 10 giờ 35 phút, và ga cuối Midorigahama dự kiến đến lúc 11 giờ 25 phút.'
      },
      {
        speaker: '車内アナウンス',
        start: 64.1,
        end: 73.0,
        cloze: '車内は{{全席禁煙|ぜんせききんえん|cấm hút thuốc toàn bộ ghế|1}}となっておりますので、お煙草を吸われるお客様は{{喫煙ルーム|きつえんルーム|phòng hút thuốc riêng|1}}をご利用ください。',
        vi: 'Trên tàu toàn bộ ghế đều cấm hút thuốc, quý khách có nhu cầu hút thuốc xin vui lòng sử dụng phòng hút thuốc.'
      },
      {
        speaker: '車内アナウンス',
        start: 73.1,
        end: 83.0,
        cloze: 'また、携帯電話のご使用は{{デッキ|デッキ|khoang đệm cửa tàu (deck)|1}}でお願いいたします。お席での通話は{{ご遠慮くださいますよう|ごえんりょくださいますよう|xin vui lòng kiềm chế, tránh|2}}お願いいたします。',
        vi: 'Đồng thời, xin quý khách sử dụng điện thoại di động tại khoang đệm nối các toa. Kính mong quý khách vui lòng tránh đàm thoại tại ghế ngồi.'
      },
      {
        speaker: '車内アナウンス',
        start: 83.1,
        end: 98.0,
        cloze: 'なお、本日、指定席は全席{{満席|まんせき|hết chỗ, kín chỗ|1}}となっておりますので、自由席から指定席への変更は{{いたしかねます|いたしかねます|khó mà làm được, không thể|2}}。{{あらかじめ|あらかじめ|trước, sẵn|1}}ご了承ください。',
        vi: 'Ngoài ra, hôm nay tất cả các ghế chỉ định đều đã kín chỗ, nên chúng tôi xin phép không thể đổi từ vé tự do sang vé chỉ định. Kính mong quý khách thông cảm trước cho điều này.'
      }
    ],
    vocabulary: [
      { word: '特別急行', kana: 'とくべつきゅうこう', meaning: 'tàu đặc cấp, tốc hành đặc biệt (tokkyuu)' },
      { word: '座席指定車', kana: 'ざせきしていしゃ', meaning: 'toa ghế đặt trước có số ghế' },
      { word: 'グリーン車', kana: 'グリーンしゃ', meaning: 'toa hạng nhất cao cấp (Green Car)' },
      { word: '車内販売', kana: 'しゃないはんばい', meaning: 'dịch vụ bán hàng lưu động trên tàu' },
      { word: '全席禁煙', kana: 'ぜんせききんえん', meaning: 'cấm hút thuốc toàn bộ ghế' },
      { word: 'デッキ', kana: 'デッキ', meaning: 'khoang đệm nối giữa các toa xe' },
      { word: 'ご遠慮ください', kana: 'ごえんりょください', meaning: 'xin vui lòng kiềm chế / không làm điều đó' },
      { word: '～かねる / いたしかねます', kana: '～かねる / いたしかねます', meaning: 'khó lòng có thể làm được, không thể thực hiện' },
      { word: 'あらかじめ', kana: 'あらかじめ', meaning: 'sẵn từ trước, chuẩn bị trước' }
    ]
  },
  {
    id: 'listen_10_3',
    lesson: '第 10 課',
    code: 'Bài 10 - Nghe 3',
    title: 'Chuyến du lịch Matsuyama, Shikoku: Suối nước nóng Dogo & Tiểu thuyết Botchan',
    jp_title: '四国・松山への旅行（坊っちゃんと道後温泉）',
    audio: 'audio/listening/bai_10_3.mp3',
    duration_label: '01:16',
    type: 'monologue',
    summary: 'Đoạn văn chia sẻ cảm xúc về chuyến đi du lịch Matsuyama (tỉnh Ehime, đảo Shikoku), ghé thăm khu suối nước nóng Dogo Onsen cổ kính - bối cảnh tiểu thuyết nổi tiếng "Botchan" của đại văn hào Natsume Soseki.',
    lines: [
      {
        speaker: '話し手',
        start: 0.0,
        end: 5.0,
        cloze: '私が{{印象に残っている|いんしょうにのこっている|đọng lại ấn tượng sâu sắc|1}}のは、四国の松山への{{旅行|りょこう|du lịch|1}}です。',
        vi: 'Điều đọng lại ấn tượng sâu sắc nhất trong tôi là chuyến du lịch đến Matsuyama thuộc đảo Shikoku.'
      },
      {
        speaker: '話し手',
        start: 5.1,
        end: 15.0,
        cloze: '旅行の数日前に{{台風|たいふう|bão gió|1}}が来ていたので、天気が心配でしたが、当日は{{幸運なことに|こううんなことに|may mắn thay|1}}雲も一つない{{青空|あおぞら|bầu trời xanh trong|1}}でした。',
        vi: 'Vài ngày trước chuyến đi có cơn bão kéo đến nên tôi khá lo lắng về thời tiết, nhưng thật may mắn là đúng ngày hôm đó bầu trời xanh ngắt không một gợn mây.'
      },
      {
        speaker: '話し手',
        start: 15.1,
        end: 22.0,
        cloze: '松山は、{{夏目漱石|なつめそうせき|Natsume Soseki (đại văn hào)|1}}が書いた『{{坊っちゃん|ぼっちゃん|Botchan (tiểu thuyết)|1}}』という小説の{{舞台|ぶたい|bối cảnh, sân khấu|1}}になったところです。',
        vi: 'Matsuyama chính là địa danh được lấy làm bối cảnh cho cuốn tiểu thuyết "Botchan" do đại văn hào Natsume Soseki sáng tác.'
      },
      {
        speaker: '話し手',
        start: 22.1,
        end: 30.0,
        cloze: '私は『坊っちゃん』を読んでから、いつか松山にある{{温泉|おんせん|suối nước nóng|1}}へ{{行ってみたい|いってみたい|muốn đi thử|1}}と思っていました。',
        vi: 'Kể từ khi đọc "Botchan", tôi đã luôn mong ước một ngày nào đó được đến suối nước nóng ở Matsuyama.'
      },
      {
        speaker: '話し手',
        start: 30.1,
        end: 36.0,
        cloze: '松山駅について、{{早速|さっそく|ngay lập tức|1}}温泉に行くために{{路面電車|ろめんでんしゃ|tàu điện mặt đất (tram)|1}}に乗りました。',
        vi: 'Vừa đến ga Matsuyama, tôi lập tức bắt xe điện mặt đất để đi đến khu suối nước nóng.'
      },
      {
        speaker: '話し手',
        start: 36.1,
        end: 43.0,
        cloze: '温泉は有名な観光地{{だけあって|だけあって|quả đúng là, hèn chi|2}}、たくさんの{{観光客|かんこうきゃく|khách du lịch|1}}で{{賑わっていました|にぎわっていました|nhộn nhịp, đông vui|2}}。',
        vi: 'Khu suối nước nóng đúng chuẩn là một danh lam thắng cảnh nổi tiếng nên vô cùng tấp nập khách du lịch ghé thăm.'
      },
      {
        speaker: '話し手',
        start: 43.1,
        end: 48.5,
        cloze: '建物もとても{{立派|りっぱ|tráng lệ, bề thế|1}}で、古い{{雰囲気|ふんいき|bầu không khí|1}}に{{感動しました|かんどうしました|xúc động, cảm phục|1}}。',
        vi: 'Kiến trúc công trình vô cùng bề thế tráng lệ, tôi rất ấn tượng và cảm động trước bầu không khí cổ kính nơi đây.'
      },
      {
        speaker: '話し手',
        start: 48.6,
        end: 55.0,
        cloze: 'わくわくしながら中に入ると、思ったより{{天井が高くて|てんじょうがたかくて|trần nhà cao|2}}{{びっくりしました|びっくりしました|bất ngờ, kinh ngạc|1}}。',
        vi: 'Vừa hồi hộp hào hứng bước vào trong, tôi đã ngạc nhiên vì trần nhà cao hơn nhiều so với tưởng tượng.'
      },
      {
        speaker: '話し手',
        start: 55.1,
        end: 61.0,
        cloze: 'ここが『坊っちゃん』に出てくるお風呂かと思って嬉しくなりました。',
        vi: 'Nghĩ rằng đây chính là phòng tắm suối nước nóng xuất hiện trong tiểu thuyết "Botchan", lòng tôi dâng trào niềm vui sướng.'
      },
      {
        speaker: '話し手',
        start: 61.1,
        end: 67.0,
        cloze: '温泉に行った{{ついでに|ついでに|nhân tiện, tiện thể|2}}、{{地元|じもと|địa phương, bản xứ|1}}の人に教えてもらった{{料理屋さん|りょうりやさん|quán ăn ngon|1}}にも行きました。',
        vi: 'Nhân tiện lúc đi tắm suối nước nóng, tôi cũng ghé qua một quán ăn địa phương do người dân bản xứ giới thiệu.'
      },
      {
        speaker: '話し手',
        start: 67.1,
        end: 74.0,
        cloze: '美味しいものもたくさん食べられて、{{大満足|だいまんぞく|vô cùng hài lòng, mãn nguyện|1}}な旅行でした。',
        vi: 'Tôi được thưởng thức rất nhiều món ăn ngon, đó quả là một chuyến du lịch trên cả tuyệt vời.'
      }
    ],
    vocabulary: [
      { word: '印象に残る', kana: 'いんしょうにのこる', meaning: 'đọng lại ấn tượng sâu đậm' },
      { word: '幸運なことに', kana: 'こううんなことに', meaning: 'thật may mắn là, phúc thay là' },
      { word: '夏目漱石', kana: 'なつめそうせき', meaning: 'Natsume Soseki (đại văn hào thời Meiji)' },
      { word: '坊っちゃん', kana: 'ぼっちゃん', meaning: 'tiểu thuyết kinh điển "Cậu ấm Botchan"' },
      { word: '舞台', kana: 'ぶたい', meaning: 'bối cảnh / sân khấu' },
      { word: '路面電車', kana: 'ろめんでんしゃ', meaning: 'tàu điện chạy trên mặt đường (tram)' },
      { word: '～だけあって', kana: '～だけあって', meaning: 'quả đúng là... hèn chi mà...' },
      { word: '賑わう', kana: 'にぎわう', meaning: 'nhộn nhịp, tấp nập khách' },
      { word: '～ついでに', kana: '～ついでに', meaning: 'nhân tiện, tiện thể...' },
      { word: '大満足', kana: 'だいまんぞく', meaning: 'cực kỳ mãn nguyện, vô cùng hài lòng' }
    ]
  },
  {
    id: 'listen_10_4',
    lesson: '第 10 課',
    code: 'Bài 10 - Nghe 4',
    title: 'Thuyết minh hướng dẫn viên du lịch Nagoya: Lâu đài Nagoya & Tượng cá kình vàng',
    jp_title: '名古屋城の観光ガイドと金の鯱（しゃちほこ）',
    audio: 'audio/listening/bai_10_4.mp3',
    duration_label: '01:16',
    type: 'monologue',
    summary: 'Hướng dẫn viên du lịch tình nguyện viên Ota thuyết minh về lịch sử Lâu đài Nagoya do Tokugawa Ieyasu xây dựng đầu thế kỷ 17, tháp canh Tenshukaku và biểu tượng tượng cá kình vàng (Kin no Shachihoko) bảo vệ thành phố khỏi hỏa hoạn.',
    lines: [
      {
        speaker: 'ガイド（大田）',
        start: 3.0,
        end: 9.0,
        cloze: '皆さん、初めまして。名古屋城{{観光ガイド|かんこうガイド|hướng dẫn viên du lịch|1}}{{ボランティア|ボランティア|tình nguyện viên|1}}の大田と{{申します|もうします|tên là (khiêm nhường)|2}}。',
        vi: 'Xin chào tất cả quý khách. Tôi tên là Ota, hướng dẫn viên du lịch tình nguyện tại Lâu đài Nagoya.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 9.1,
        end: 16.0,
        cloze: 'これからの1時間、{{ご案内をさせていただきます|ごあんないをさせていただきます|xin phép được hướng dẫn (khiêm nhường)|2}}。どうぞよろしくお願いいたします。',
        vi: 'Trong 1 tiếng sắp tới, tôi xin phép được hướng dẫn quý khách. Rất mong nhận được sự hợp tác của mọi người.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 16.1,
        end: 21.0,
        cloze: 'では、この名古屋城について{{ご説明いたします|ごせつめいいいたします|xin phép giải thích|2}}。',
        vi: 'Sau đây, tôi xin thuyết minh đôi nét về lâu đài Nagoya này.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 21.1,
        end: 29.5,
        cloze: '名古屋城は、17世紀初めに{{徳川家康|とくがわいえやす|Tokugawa Ieyasu (Tướng quân Mạc phủ Edo)|1}}が建てた、日本を{{代表する|だいひょうする|đại diện, tiêu biểu cho|1}}お城の一つです。',
        vi: 'Lâu đài Nagoya do Tokugawa Ieyasu xây dựng vào đầu thế kỷ 17, là một trong những lâu đài tiêu biểu hàng đầu đại diện cho đất nước Nhật Bản.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 29.6,
        end: 36.0,
        cloze: '名古屋の人々はこのお城を大切に思い、{{誇り|ほこり|niềm tự hào|1}}にしています。',
        vi: 'Người dân Nagoya luôn hết sức trân trọng và xem tòa lâu đài này là niềm tự hào của mình.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 36.1,
        end: 44.0,
        cloze: '一度{{戦争|せんそう|chiến tranh|1}}で焼けてしまいましたが、{{天守閣|てんしゅかく|tháp canh chính lâu đài|1}}は1959年に{{再び|ふたたび|lại một lần nữa|1}}建てられました。',
        vi: 'Tòa lâu đài từng bị thiêu rụi một lần trong chiến tranh, nhưng tòa tháp canh Tenshukaku đã được tái thiết dựng lại vào năm 1959.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 44.1,
        end: 51.0,
        cloze: '{{屋根|やね|mái nhà|1}}の上には、{{高さ|たかさ|chiều cao|1}}約3メートルの{{金の鯱|きんのしゃちほこ|tượng cá kình thếp vàng|1}}があります。',
        vi: 'Trên nóc mái của lâu đài có gắn bức tượng cá kình bằng vàng (Kin no Shachihoko) cao khoảng 3 mét.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 51.1,
        end: 62.0,
        cloze: '鯱とは、体は魚で、頭が虎の{{姿をしている|すがたをしている|mang hình dáng của|2}}動物で、雨を{{降らせる|ふらせる|làm cho mưa rơi|2}}力があるそうです。',
        vi: 'Shachihoko là loài linh thú mang hình dáng thân cá đầu hổ, được truyền thuyết kể rằng có sức mạnh hô mưa gọi gió làm mưa rơi xuống.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 62.1,
        end: 68.0,
        cloze: 'そのため、名古屋の町を{{火事|かじ|hỏa hoạn, cháy nhà|1}}などの{{災害|さいがい|thảm họa, thiên tai|1}}から{{守る|まもる|bảo vệ|1}}と{{言われています|いわれています|được tương truyền là|2}}。',
        vi: 'Chính vì thế, tượng linh thú này được tương truyền là bảo vệ thành phố Nagoya khỏi những thảm họa như hỏa hoạn.'
      },
      {
        speaker: 'ガイド（大田）',
        start: 68.1,
        end: 72.0,
        cloze: 'では、あちらから{{お入りください|おはいりください|xin mời bước vào|2}}。',
        vi: 'Bây giờ, xin kính mời quý khách cùng bước vào từ phía đằng kia.'
      }
    ],
    vocabulary: [
      { word: '観光ガイド', kana: 'かんこうガイド', meaning: 'hướng dẫn viên du lịch' },
      { word: 'ボランティア', kana: 'ボランティア', meaning: 'tình nguyện viên' },
      { word: '～（さ）せていただく', kana: '～（さ）せていただく', meaning: 'xin phép được làm (khiêm nhường ngữ)' },
      { word: '代表する', kana: 'だいひょうする', meaning: 'đại diện, tiêu biểu cho' },
      { word: '誇りにする', kana: 'ほこりにする', meaning: 'lấy làm tự hào, hãnh diện' },
      { word: '天守閣', kana: 'てんしゅかく', meaning: 'tháp canh chính của lâu đài Nhật cổ' },
      { word: '金の鯱', kana: 'きんのしゃちほこ', meaning: 'tượng cá kình vàng mình cá đầu hổ trên mái lâu đài' },
      { word: '姿をしている', kana: 'すがたをしている', meaning: 'mang hình dáng, diện mạo của...' },
      { word: '～と言われている', kana: '～といわれている', meaning: 'được tương truyền rằng, người ta bảo rằng...' },
      { word: '災害', kana: 'さいがい', meaning: 'thảm họa, thiên tai' }
    ]
  },
  {
    id: 'listen_10_5',
    lesson: '第 10 課',
    code: 'Bài 10 - Nghe 5',
    title: 'Khám phá thiên nhiên Shiretoko: Thác nước Furepe & Lưu ý an toàn',
    jp_title: '知床自然ガイド：フレペの滝散策コース',
    audio: 'audio/listening/bai_10_5.mp3',
    duration_label: '01:18',
    type: 'monologue',
    summary: 'Hướng dẫn viên tự nhiên Yamakawa phổ biến về lộ trình tản bộ 2 tiếng khám phá thác Furepe (dòng nước ngầm tuôn từ vách đá như giọt nước mắt) tại bán đảo Shiretoko, kèm các lưu ý quan trọng về thời tiết, gấu hoang và vệ sinh.',
    lines: [
      {
        speaker: '自然ガイド（山川）',
        start: 4.0,
        end: 11.5,
        cloze: '皆さん、こんにちは。{{フレペの滝|フレペのたき|thác Furepe|1}}{{散策コース|さんさくコース|lộ trình đi dạo, tản bộ|1}}にご{{参加いただき|さんかいただき|tham gia (kính ngữ)|2}}、ありがとうございます。',
        vi: 'Xin chào tất cả mọi người. Cảm ơn quý khách đã tham gia lộ trình tản bộ khám phá thác Furepe.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 11.6,
        end: 17.0,
        cloze: '私、{{知床|しれとこ|bán đảo Shiretoko (Hokkaido)|1}}{{自然ガイド|しぜんガイド|hướng dẫn viên thiên nhiên|1}}の山川と{{申します|もうします|tên là (khiêm nhường)|2}}。',
        vi: 'Tôi là Yamakawa, hướng dẫn viên tự nhiên khu vực bán đảo Shiretoko.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 17.1,
        end: 20.5,
        cloze: 'これからコースの{{ご説明をさせていただきます|ごせつめいをさせていただきます|xin phép được thuyết minh giải thích|2}}。',
        vi: 'Sau đây tôi xin phép được phổ biến thông tin về cung đường dạo này.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 20.6,
        end: 26.0,
        cloze: 'このコースでは、約2時間の散策をお{{楽しみいただけます|たのしみいただけます|có thể thưởng thức, tận hưởng|2}}。',
        vi: 'Trong lộ trình này, quý khách sẽ được tận hưởng chuyến tản bộ kéo dài khoảng 2 giờ đồng hồ.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 26.1,
        end: 33.0,
        cloze: '{{見どころ|みどころ|điểm nhấn đáng xem nhất|1}}は何と言っても、川がないのに{{滝が流れる|たきがながれる|thác nước chảy tuôn|1}}フレペの滝です。',
        vi: 'Điểm nhấn đáng xem nhất ở đây không gì khác chính là thác Furepe – dù không hề có dòng sông nào nhưng dòng thác vẫn ngày đêm tuôn chảy.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 33.1,
        end: 42.0,
        cloze: '{{崖|がけ|vách núi, vách đá dốc|1}}を流れる水は、まるで{{涙のように見えます|なみだのようにみえます|trông như những giọt nước mắt|2}}。そして、動物との{{出会い|であい|gặp gỡ, chạm trán|1}}もあるかもしれません。',
        vi: 'Dòng nước ngầm rỉ chảy dọc theo vách đá trông hệt như những dòng nước mắt rơi. Ngoài ra, biết đâu quý khách còn có cơ hội bắt gặp những loài động vật hoang dã nữa.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 42.1,
        end: 45.0,
        cloze: 'いくつかの{{ご注意|ごちゅうい|lưu ý, nhắc nhở|1}}を申し上げます。',
        vi: 'Sau đây tôi xin nêu ra một vài điều quý khách cần hết sức lưu ý.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 45.1,
        end: 53.0,
        cloze: 'この辺りは{{急に|きゅうに|đột ngột, bất thình lình|1}}天気が変わる場合があります。皆さん、{{レインコート|レインコート|áo mưa|1}}などはお持ちでしょうか。',
        vi: 'Khu vực này thời tiết có lúc thay đổi rất đột ngột. Quý khách đã mang theo sẵn áo mưa hoặc đồ che mưa chưa ạ?'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 53.1,
        end: 58.0,
        cloze: '{{歩道|ほどう|đường đi bộ, lối đi dạo|1}}は{{滑りやすい|すべりやすい|dễ trơn trượt|1}}ので、{{足元|あしもと|bước chân, dưới chân|1}}にお気をつけください。',
        vi: 'Lối đi bộ rất dễ trơn trượt, vì vậy xin quý khách hãy cẩn thận từng bước chân của mình.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 58.1,
        end: 64.0,
        cloze: 'また、{{熊|くま|gấu hoang dã|1}}が出る{{ことがあります|ことがあります|có khi, thỉnh thoảng xảy ra|2}}ので、お一人にならないようにお気をつけください。',
        vi: 'Đặc biệt, nơi đây thỉnh thoảng có gấu xuất hiện, vì vậy quý khách hãy chú ý không bao giờ đi tách lẻ một mình.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 64.1,
        end: 70.0,
        cloze: '途中に{{トイレ|トイレ|nhà vệ sinh|1}}はございませんので、こちらで{{お済ませください|おすませください|xin hãy giải quyết xong trước|2}}。',
        vi: 'Dọc đường đi sẽ không có nhà vệ sinh nào, vì vậy xin quý khách hãy đi vệ sinh xong xuôi ngay tại đây.'
      },
      {
        speaker: '自然ガイド（山川）',
        start: 70.1,
        end: 74.0,
        cloze: 'では、10分後に{{お集まりください|おあつまりください|tập trung lại (kính ngữ)|2}}。',
        vi: 'Bây giờ xin hẹn quý khách tập trung lại sau 10 phút nữa nhé.'
      }
    ],
    vocabulary: [
      { word: '散策コース', kana: 'さんさくコース', meaning: 'cung đường dạo bộ, lộ trình ngắm cảnh' },
      { word: '見どころ', kana: 'みどころ', meaning: 'điểm nhấn nổi bật, cảnh quan đáng xem nhất' },
      { word: '何と言っても', kana: 'なんといっても', meaning: 'dù sao đi nữa thì điểm số 1 vẫn là...' },
      { word: '崖', kana: 'がけ', meaning: 'vách núi, vách đá dựng đứng' },
      { word: 'まるで～のように', kana: 'まるで～のように', meaning: 'cứ như thể là..., hệt như là...' },
      { word: '滑りやすい', kana: 'すべりやすい', meaning: 'dễ trơn trượt' },
      { word: '足元にお気をつけください', kana: 'あしもとにおきをつけください', meaning: 'xin hãy cẩn thận bước chân' },
      { word: 'お済ませください', kana: 'おすませください', meaning: 'xin hãy hoàn tất / giải quyết xong trước' }
    ]
  }
];
