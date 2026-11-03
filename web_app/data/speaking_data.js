/**
 * JPD326 Speaking Situations & Reference Dialogues
 * Extracted directly from hoi_thoai/cac_tinh_huong.docx
 */

window.SPEAKING_DATA = [
  {
    id: "bai_6_1",
    lesson: "第 6 課",
    code: "Bài 6.1",
    title: "Tư vấn sức khỏe khi bạn chán ăn do giao mùa",
    jp_title: "食欲不振・健康アドバイス",
    roleA: {
      name: "Người A (Người khuyên)",
      task_jp: "友達の B さんは体の調子が良くないようです。話を聞いて、どうしたらいいか、アドバイスしてください。よく言われている体にいい食べ物についても話してください。",
      task_vi: "Bạn B có vẻ không được khỏe. Hãy lắng nghe bạn nói, cho lời khuyên nên làm gì. Hãy nói về những món ăn/thực phẩm tốt cho sức khỏe thường được mọi người khuyên dùng."
    },
    roleB: {
      name: "Người B (Người xin lời khuyên)",
      task_jp: "あなたは、最近、あまり食欲がありません。季節が変わったために、体調を崩(くず)してしまったようです。友達の A さんにアドバイスをもらってください。",
      task_vi: "Dạo này bạn không có cảm giác thèm ăn. Do thời tiết giao mùa nên cơ thể bị mệt/ốm. Hãy xin lời khuyên từ bạn A."
    },
    extra_info: [
      "Ngữ pháp trọng tâm: 〜と言われている (nghe nói là/người ta bảo là), 〜たらどうですか (thử làm... xem sao), 〜ために (vì/do)",
      "Từ vựng gợi ý: 食欲 (thèm ăn), 体調を崩す (mệt mỏi/suy sụp sức khỏe), 生姜 (gừng), 納豆 (đậu natto), スープ (súp)"
    ],
    default_turns: [
      {
        a: "Bさん、顔色が良くないようだけど、どうしたの？",
        b: "うん、最近、季節の変わり目のせいで、あまり食欲がないんだ。",
        vi_a: "B này, trông sắc mặt cậu không được tốt, có chuyện gì thế?",
        vi_b: "Ừ, dạo này do giao mùa nên tớ chẳng có cảm giác thèm ăn gì cả."
      },
      {
        a: "そうなんだ。食欲がない時は、無理にたくさん食べないほうがいいよ。でも、体にいい食べ物を少しでもとったほうがいいね。",
        b: "体にいい食べ物って、例えばどんなものがある？",
        vi_a: "Ra vậy. Lúc không thèm ăn thì không nên ép ăn nhiều. Nhưng nên bổ sung chút đồ ăn tốt cho sức khỏe.",
        vi_b: "Đồ ăn tốt cho sức khỏe ví dụ như món nào nhỉ?"
      },
      {
        a: "生姜や納豆は、昔から疲労回復や免疫力アップに効果があると言われているよ。スープに生姜を入れて飲んでみたらどう？",
        b: "へえ、生姜入りのスープね。温まりそうだし、良さそうだね。ありがとう、今日試してみるよ。",
        vi_a: "Gừng và đậu Natto từ xưa đã được cho là có hiệu quả phục hồi mệt mỏi và tăng miễn dịch đấy. Thử cho gừng vào súp uống xem sao?",
        vi_b: "Ồ, súp gừng à. Có vẻ ấm người và tốt đấy. Cảm ơn cậu, hôm nay tớ sẽ thử."
      },
      {
        a: "うん、早く良くなるといいね。無理しないで、ゆっくり休んでね。",
        b: "ありがとう、Aさんも気をつけてね！",
        vi_a: "Ừ, mong cậu sớm khỏe lại nhé. Đừng quá sức, hãy nghỉ ngơi nhiều vào nhé.",
        vi_b: "Cảm ơn cậu nhé, A cũng giữ gìn sức khỏe nha!"
      }
    ]
  },
  {
    id: "bai_6_2",
    lesson: "第 6 課",
    code: "Bài 6.2",
    title: "Tư vấn sức khỏe khi bạn bị mất ngủ do bận rộn",
    jp_title: "睡眠不足・リラックス法",
    roleA: {
      name: "Người A (Người khuyên)",
      task_jp: "友達の B さんは具合が良くないようです。話を聞いて、どうしたらいいか、アドバイスしてください。寝られるようにいい方法についても話してください。",
      task_vi: "Bạn B có vẻ không được khỏe. Hãy lắng nghe bạn nói, cho lời khuyên nên làm gì. Hãy nói về những phương pháp hay để có thể ngủ ngon."
    },
    roleB: {
      name: "Người B (Người xin lời khuyên)",
      task_jp: "あなたは、最近、あまり寝られません。忙しくて、体調を崩してしまったようです。友達の A さんにアドバイスをもらってください。",
      task_vi: "Dạo này bạn không ngủ được nhiều. Do công việc bận rộn nên cơ thể bị mệt/ốm. Hãy xin lời khuyên từ bạn A."
    },
    extra_info: [
      "Ngữ pháp trọng tâm: 〜ように (để mà), 〜ようにしている (cố gắng làm gì), 〜たらいい (làm... thì tốt)",
      "Từ vựng gợi ý: 睡眠不足 (thiếu ngủ), カモミールティー (trà hoa cúc), お風呂 (ngâm bồn), リラックス (thư giãn)"
    ],
    default_turns: [
      {
        a: "Bさん、目の下にクマができているよ。具合でも悪いの？",
        b: "うん、最近仕事が忙しくて、夜あまり寝られないんだ。体調を崩しちゃって。",
        vi_a: "B ơi, mắt cậu có quầng thâm kìa. Không khỏe ở đâu à?",
        vi_b: "Ừ, dạo này công việc bận rộn quá nên đêm tớ không ngủ được. Cơ thể mệt mỏi hết cả."
      },
      {
        a: "それは大変だね。眠れない時は、寝る前にスマホやパソコンを見ないようにしたほうがいいよ。",
        b: "ついついベッドでスマホを見ちゃうんだよね。寝られるように何かいい方法はある？",
        vi_a: "Thế thì vất vả quá. Lúc khó ngủ thì trước khi ngủ không nên nhìn vào điện thoại hay máy tính.",
        vi_b: "Tớ cứ hay tiện tay lướt điện thoại trên giường. Có cách nào hay để dễ ngủ không?"
      },
      {
        a: "温かいハーブティーを飲んだり、ぬるめのお風呂にゆっくり入ったりするとリラックスできると言われているよ。",
        b: "なるほど。お風呂にゆっくり入って、ハーブティーを飲んでみるよ。アドバイスありがとう！",
        vi_a: "Người ta bảo uống trà thảo mộc ấm hoặc ngâm bồn nước ấm từ từ sẽ giúp thư giãn đấy.",
        vi_b: "Ra là vậy. Tớ sẽ ngâm bồn từ từ và uống trà thảo mộc thử xem. Cảm ơn lời khuyên của cậu nhé!"
      },
      {
        a: "どういたしまして。今夜はぐっすり眠れるといいね。",
        b: "うん、今夜さっそくやってみるよ。おやすみ！",
        vi_a: "Không có gì đâu. Chúc cậu tối nay ngủ thật ngon nhé.",
        vi_b: "Ừ, tối nay tớ thử ngay. Chúc ngủ ngon nhé!"
      }
    ]
  },
  {
    id: "bai_7_1",
    lesson: "第 7 課",
    code: "Bài 7.1",
    title: "Rủ bạn cùng lớp tiếng Anh tham gia chợ đồ cũ Flea Market",
    jp_title: "フリーマーケットの誘い",
    roleA: {
      name: "Người A (Người rủ)",
      task_jp: "あなたは友達とフリーマーケットに出店することにしました。同じ英語のクラスに通っている B さんにも来てもらいたいです。B さんとは時々挨拶するくらいです。クラスで会ったとき、フリーマーケットについて説明し、都合を聞いて、誘ってください。",
      task_vi: "Bạn cùng bạn bè mở quầy ở hội chợ đồ cũ Flea Market. Bạn muốn rủ B (học cùng lớp tiếng Anh, thỉnh thoảng chào hỏi nhau) cùng tham gia. Khi gặp B ở lớp, hãy giải thích về hội chợ, hỏi thời gian rảnh và rủ bạn tham gia."
    },
    roleB: {
      name: "Người B (Người được rủ)",
      task_jp: "あなたは A さんと同じ英語のクラスに通っています。A さんとは時々クラスで挨拶するくらいです。A さんが話しかけてきました。話をよく聞いて、A さんの誘いを受けてください。",
      task_vi: "Bạn học cùng lớp tiếng Anh với A, thỉnh thoảng chào hỏi nhau. A bắt chuyện với bạn. Hãy lắng nghe và nhận lời mời của A."
    },
    extra_info: [
      "Thông tin hội chợ Flea Market:",
      "・日時：来週の土曜日と日曜日 午前８時から (Thời gian: Thứ 7 và CN tuần sau từ 8h sáng)",
      "・このフリーマーケットには自分が作った料理を出してもいいです。 (Được mang đồ ăn tự nấu ra bán)",
      "・商品の値段の２割がホームレスの寄付金になります。 (20% tiền bán hàng sẽ quyên góp cho người vô gia cư)"
    ],
    default_turns: [
      {
        a: "Bさん、こんにちは！今日の英語の授業、お疲れ様でした。今ちょっとお時間ありますか？",
        b: "あ、Aさん、こんにちは。ええ、大丈夫ですよ。どうしましたか？",
        vi_a: "Chào bạn B! Buổi học tiếng Anh hôm nay vất vả rồi. Bây giờ bạn có chút thời gian không?",
        vi_b: "A, chào A. Được chứ, tớ rảnh. Có chuyện gì thế?"
      },
      {
        a: "実は、友達と一緒に来週のフリーマーケットに出店することにしたんです。来週の土曜日と日曜日の午前8時からなんですが、Bさんも来てみませんか？",
        b: "フリーマーケットですか！面白そうですね。どんなマーケットなんですか？",
        vi_a: "Thực ra là tớ cùng bạn mở quầy ở hội chợ đồ cũ tuần sau. Vào thứ 7 và CN từ 8h sáng, B có muốn đến tham gia không?",
        vi_b: "Hội chợ đồ cũ à! Nghe thú vị thế. Đó là hội chợ như thế nào vậy?"
      },
      {
        a: "自分で作った料理を出すこともできますし、売上の2割はホームレスの方への寄付金になるんです。",
        b: "へえ、チャリティーにもなるんですね！土曜日の午前中ならちょうど空いています。ぜひ参加させてください。",
        vi_a: "Mình có thể mang món ăn tự nấu ra bán, và 20% doanh thu sẽ quyên góp cho người vô gia cư đấy.",
        vi_b: "Ồ, vừa hay làm từ thiện được luôn nhỉ! Sáng thứ 7 tớ đang rảnh. Nhất định cho tớ tham gia với nhé."
      },
      {
        a: "本当ですか？ありがとうございます！じゃあ、詳しい場所と時間は後でメッセージで送りますね。",
        b: "はい、楽しみにしています。メッセージ待っていますね！",
        vi_a: "Thật ạ? Cảm ơn B nhiều nhé! Vậy địa điểm và thời gian cụ thể lát nữa tớ gửi tin nhắn nhé.",
        vi_b: "Vâng, tớ mong đợi lắm. Chờ tin nhắn của bạn nhé!"
      }
    ]
  },
  {
    id: "bai_7_2",
    lesson: "第 7 課",
    code: "Bài 7.2",
    title: "Rủ bạn cùng lớp tiếng Anh tham gia tình nguyện dạy học ở cô nhi viện",
    jp_title: "孤児院英語ボランティアの誘い",
    roleA: {
      name: "Người A (Người rủ)",
      task_jp: "あなたはボランテイア活動に参加することにしました。同じ英語の中級クラスに通っている B さんにも来てもらいたいです。B さんとは時々挨拶するくらいです。クラスで会ったとき、ボランテイア活動について説明し、都合を聞いて、誘ってください。",
      task_vi: "Bạn tham gia hoạt động tình nguyện. Muốn rủ B (học cùng lớp tiếng Anh trung cấp, thỉnh thoảng chào hỏi nhau) cùng tham gia. Khi gặp ở lớp, hãy giải thích về hoạt động, hỏi lịch rảnh và rủ bạn tham gia."
    },
    roleB: {
      name: "Người B (Người được rủ)",
      task_jp: "あなたは A さんと同じ英語の中級クラスに通っています。A さんとは時々クラスで挨拶するくらいです。A さんが話しかけてきました。話をよく聞いて、A さんの誘いを受けてください。",
      task_vi: "Bạn học cùng lớp tiếng Anh trung cấp với A. A bắt chuyện với bạn. Hãy lắng nghe và nhận lời mời của A."
    },
    extra_info: [
      "Thông tin hoạt động tình nguyện:",
      "・日時：毎週の土曜日 午前８時から１０時まで (Thời gian: Sáng thứ 7 hàng tuần từ 8h đến 10h)",
      "・地方の孤児院 (こじいん) で子どもたちに初級レベルの英語を教える。 (Dạy tiếng Anh sơ cấp cho trẻ em ở cô nhi viện)",
      "・活動に参加する人は後で英語の中級コースに無料で参加できる。 (Người tham gia sau đó được học miễn phí khóa tiếng Anh trung cấp)"
    ],
    default_turns: [
      {
        a: "Bさん、こんにちは！英語の授業、お疲れ様でした。今少しだけお話しできますか？",
        b: "あ、Aさん。こんにちは！ええ、大丈夫ですよ。何かありましたか？",
        vi_a: "Chào B! Buổi học tiếng Anh vất vả rồi. Bây giờ bạn nói chuyện được chút không?",
        vi_b: "A, chào A! Vâng, được chứ. Có chuyện gì thế?"
      },
      {
        a: "実は私、地域のボランティア活動に参加することにしたんです。毎週土曜日の午前8時から10時まで、地方の孤児院で子どもたちに英語を教える活動なんですが、Bさんも一緒に行きませんか？",
        b: "孤児院で子どもたちに英語を教えるんですか！素敵な活動ですね。",
        vi_a: "Thực ra là tớ định tham gia hoạt động tình nguyện. Vào sáng thứ 7 từ 8h-10h, dạy tiếng Anh cho trẻ em ở cô nhi viện, B có muốn đi cùng không?",
        vi_b: "Dạy tiếng Anh cho trẻ em ở cô nhi viện ạ! Hoạt động ý nghĩa quá."
      },
      {
        a: "ええ。しかも参加した人は、後で英語の中級コースに無料で参加できる特典もあるんですよ。",
        b: "えっ、本当ですか！子どもと触れ合うのも好きですし、英語のコースも魅力的ですね。ぜひ参加したいです！",
        vi_a: "Ừ. Hơn nữa người tham gia sau đó còn được học miễn phí khóa tiếng Anh trung cấp nữa đấy.",
        vi_b: "Hả, thật ạ! Tớ vừa thích chơi với trẻ con, khóa tiếng Anh lại hấp dẫn nữa. Nhất định cho tớ tham gia với!"
      },
      {
        a: "よかった！Bさんが来てくれると本当に心強いです。じゃあ、申し込みの手続きについて後で連絡しますね。",
        b: "はい、ありがとうございます！連絡をお待ちしていますね。",
        vi_a: "Tốt quá! Có B đi cùng thì tớ an tâm hẳn. Vậy lát nữa tớ liên lạc về thủ tục đăng ký nhé.",
        vi_b: "Vâng, cảm ơn A nhiều! Tớ chờ liên lạc của cậu nhé."
      }
    ]
  },
  {
    id: "bai_8_1",
    lesson: "第 8 課",
    code: "Bài 8.1",
    title: "Xin phép quản lý nghỉ làm thêm 1 tuần về quê dự đám cưới bạn thân",
    jp_title: "アルバイトの休暇申請",
    roleA: {
      name: "Người A (Nhân viên làm thêm)",
      task_jp: "あなたはアルバイトをしています。来月末の 1 週間、友人が結婚するので、ふるさとへ帰りたいです。休みをもらえるように、店長に丁寧に頼んでください。",
      task_vi: "Bạn đang làm thêm. Cuối tháng tới trong vòng 1 tuần, bạn thân kết hôn nên bạn muốn về quê. Hãy xin phép quản lý một cách lịch sự để được nghỉ."
    },
    roleB: {
      name: "Người B (Quản lý / 店長)",
      task_jp: "あなたは店長です。店は月末とても忙しいです。A さんの話をよく聞いて、A さんの代わりにアルバイトをやってもらう人がいるか確認してから、休む許可を出してください。",
      task_vi: "Bạn là quản lý quán. Quán cuối tháng rất bận rộn. Hãy lắng nghe A nói, xác nhận xem có ai làm thay ca không rồi mới cho phép nghỉ."
    },
    extra_info: [
      "Ngữ pháp trọng tâm: 〜ていただけないでしょうか (xin phép lịch sự), 〜ことになりまして (vì có việc là...), 〜代わりに (thay cho)",
      "Lưu ý kính ngữ: お忙しいところ恐れ入ります (xin lỗi làm phiền lúc bận), 休暇をいただく (nhận phép nghỉ)"
    ],
    default_turns: [
      {
        a: "店長、今お時間よろしいでしょうか。少しご相談したいことがあるのですが。",
        b: "はい、Aさん。どうしましたか？何かありましたか？",
        vi_a: "Thưa quản lý, bây giờ anh/chị có tiện chút thời gian không ạ? Em có chút việc muốn trao đổi ạ.",
        vi_b: "Ừ, A à. Có chuyện gì thế? Có việc gì à em?"
      },
      {
        a: "実は、来月末にふるさとの親友の結婚式がありまして、1週間ほどお休みをいただきたいのですが、よろしいでしょうか。",
        b: "来月末ですか...。うーん、月末は店が一番忙しい時期だから、1週間も休まれると正直厳しいですね。",
        vi_a: "Thực ra là cuối tháng tới bạn thân ở quê em cưới, em muốn xin phép nghỉ khoảng 1 tuần có được không ạ?",
        vi_b: "Cuối tháng sau à... Ừm, cuối tháng là lúc quán bận nhất, nghỉ cả tuần thì thật sự hơi khó cho quán đấy."
      },
      {
        a: "忙しい時期に本当に申し訳ございません。一生に一度の親友の晴れ舞台なので、どうしても出席したくて...。",
        b: "そうですか、親友の式なら仕方ないですね。でも、Aさんの代わりにシフトに入ってくれる人は見つかりましたか？",
        vi_a: "Em thật sự xin lỗi vì xin nghỉ vào lúc bận rộn. Vì là đám cưới người bạn thân nhất đời em nên em rất muốn có mặt ạ...",
        vi_b: "Vậy à, đám cưới bạn thân thì cũng khó tránh. Nhưng em đã tìm được ai làm thay ca cho em chưa?"
      },
      {
        a: "はい！山田さんと田中さんにお願いしましたところ、私のシフトを代わって引き受けてくれると言ってくれました。",
        b: "代わりの人が見つかっているなら安心ですね。分かりました、今回は特別にお休みを認めます。結婚式、お祝いしてきてあげてください。",
        vi_a: "Dạ có ạ! Em đã nhờ anh Yamada và anh Tanaka, hai người đều đồng ý nhận làm thay ca cho em rồi ạ.",
        vi_b: "Nếu đã có người thay ca thì quán an tâm rồi. Được rồi, lần này tôi đồng ý cho em nghỉ. Đi dự đám cưới bạn vui vẻ nhé."
      },
      {
        a: "ありがとうございます！ご迷惑をおかけして本当に申し訳ありませんでした。休み明けはしっかり働きます！",
        b: "はい、気をつけて帰省してくださいね。",
        vi_a: "Em cảm ơn quản lý rất nhiều ạ! Đã làm phiền quán em xin lỗi ạ. Sau kỳ nghỉ em sẽ làm việc thật chăm chỉ ạ!",
        vi_b: "Được rồi, về quê đi lại cẩn thận nhé."
      }
    ]
  },
  {
    id: "bai_10_1",
    lesson: "第 10 課",
    code: "Bài 10.1",
    default_first_speaker: "b",
    title: "Gọi điện đến quán cà phê tìm ví bỏ quên và nhờ gửi chuyển phát COD",
    jp_title: "忘れ物の問い合わせ・着払い配送",
    roleA: {
      name: "Người A (Khách để quên ví)",
      task_jp: "あなたは喫茶店に財布を忘れました。帰りのバスの中で、そのことに気がつきました。喫茶店に電話をしてください。あなたは右の窓側の席に座りました。財布はテーブルの上に置いたと思いますが、はっきり覚えていません。見つかったら、着払いの宅配便で送ってもらえるようにお願いしてください。",
      task_vi: "Bạn để quên ví ở quán cà phê. Đang trên xe buýt về thì nhận ra. Hãy gọi điện cho quán: ngồi bàn cạnh cửa sổ bên phải, ví để trên bàn nhưng không nhớ rõ. Nhờ nếu tìm thấy thì gửi bưu điện thu tiền người nhận (COD) giúp."
    },
    roleB: {
      name: "Người B (Nhân viên / Quản lý quán cà phê)",
      task_jp: "あなたは喫茶店の店員／店長です。お客様（Aさん）から財布の忘れ物について電話がかかってきました。財布の特徴や席を確認して店を探し、見つかったら着払いで送る手配をしてください。",
      task_vi: "Bạn là nhân viên/quản lý quán cà phê. Nhận điện thoại hỏi tìm ví của khách A. Hãy hỏi đặc điểm ví, kiểm tra, xác nhận tìm thấy và hướng dẫn gửi chuyển phát COD."
    },
    extra_info: [
      "Thông tin chiếc ví bỏ quên:",
      "・形状・色：四角い、グレー (Hình vuông, màu xám)",
      "・模様・特徴：花模様がある、名前もつけてあります (Có họa tiết hoa, có gắn tên bên trong)",
      "・Vị trí ngồi: 右の窓側の席 (Bàn bên phải cạnh cửa sổ)"
    ],
    default_turns: [
      {
        a: "お忙しいところ恐れ入ります。本日そちらの喫茶店を利用した者ですが、財布を忘れてしまったかもしれなくて、お電話いたしました。",
        b: "お電話ありがとうございます、さくら喫茶店でございます。お忘れ物の財布ですね。座られていたお席や財布の特徴を教えていただけますか？",
        vi_a: "Xin lỗi đã làm phiền lúc quán đang bận. Em là khách dùng đồ uống hôm nay, em nghĩ mình có thể đã để quên ví tại quán nên gọi điện hỏi ạ.",
        vi_b: "Cảm ơn quý khách đã gọi, quán cà phê Sakura xin nghe. Ví bỏ quên đúng không ạ. Bạn có thể cho biết vị trí ngồi và đặc điểm của ví được không ạ?"
      },
      {
        a: "はい、右側の窓側の席に座っていました。財布は四角いグレーのもので、花模様があって、中に私の名前が書いてあります。",
        b: "かしこまりました。確認してまいりますので、少々お待ちいただけますでしょうか。...お待たせいたしました！確かにレジにて保管しております。",
        vi_a: "Dạ, em ngồi bàn cạnh cửa sổ phía bên phải. Ví hình vuông màu xám, có hoa văn và bên trong có ghi tên em ạ.",
        vi_b: "Dạ vâng. Xin bạn chờ một lát để tôi kiểm tra... Đã để bạn đợi lâu! Đúng là quán đang cất giữ chiếc ví này ở quầy thu ngân rồi ạ."
      },
      {
        a: "ああ、本当によかったです！実は今帰りのバスの中で、すぐ取りに戻れなくて...。見つかった財布を、着払いの宅配便で送っていただくことは可能でしょうか？",
        b: "はい、着払いの宅配便でございましたら発送の手配が可能でございます。お客様のお名前、ご住所、お電話番号を教えていただけますでしょうか。",
        vi_a: "Ôi may quá ạ! Thực ra giờ em đang trên xe buýt về nhà, không quay lại lấy ngay được... Quán có thể gửi chuyển phát COD về nhà giúp em được không ạ?",
        vi_b: "Vâng, gửi chuyển phát nhanh thu tiền người nhận (COD) thì quán làm được ạ. Bạn vui lòng đọc họ tên, địa chỉ và số điện thoại giúp tôi ạ."
      },
      {
        a: "ありがとうございます！名前はグエンで、住所は...。お手数をおかけして本当に申し訳ありません。よろしくお願いいたします！",
        b: "かしこまりました。本日中に発送の手配をいたしますね。それでは失礼いたします。",
        vi_a: "Dạ em cảm ơn nhiều ạ! Tên em là Nguyen, địa chỉ là... Đã làm phiền quán nhiều em xin lỗi ạ. Nhờ quán giúp em ạ!",
        vi_b: "Vâng tôi đã ghi lại. Quán sẽ làm thủ tục gửi trong ngày hôm nay nhé. Chào bạn ạ."
      }
    ]
  }
];
