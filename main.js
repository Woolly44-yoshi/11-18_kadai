//入力した文字を見る
// function research(){
//     var word = $('word').val(); /* val箱の中身をとる */
//     research(word);
// }  console.log("入力とりました")



// ①単語を分ける箱を用意する
let tokenizer = null;
// let(レット)= あとで中身を変えられる箱を作る
// tokenizer(トークナイザー=単語に分ける係)= 箱の名前。
// null(ヌル)= わざと空っぽ。辞書ができるまで役割がないので、空にしておく
// 一番上に置く理由 = ②の中からも③の中からも、同じ箱を使えるようにするため

// ②ページを開いたら辞書を準備する
kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/" })
// kuromoji(クロモジ)= HTMLで読み込んだ形態素解析の道具
// .builder(ビルダー=作る人)= 「係を作る準備をして」とお願いする
// { dicPath: "…" }(ディックパス=辞書の場所)= 辞書がどこにあるかを教える設定
  .build(function (err, t) {
  // .build(ビルド=組み立てる)= 辞書を読み込んで係を組み立てる(数秒かかる)
  // function (err, t) = 組み立てが終わったら、この { } の中を動かして、というお願い
  // err(エラー)= 失敗したとき、kuromoji が知らせを入れてくれる(引数)
  // t(ティー)= 成功したとき、kuromoji ができた係を入れてくれる(引数)
    if (err) {
    // if(イフ=もし)= もし err に何か入っていたら(=失敗していたら)
      $("#status").text("辞書の読み込みに失敗しました");
      // $("#status")= id が status の部品をつかむ / .text(テキスト)= 文字を書きかえる
      return;
      // return(リターン=戻る)= ここで終わり。下には進まない
    }
    tokenizer = t;
    // 届いた係 t を、①の空っぽの箱 tokenizer に入れる。これで null ではなくなる
    $("#status").text("準備OK!");
    console.log("辞書を準備できました");
    // console.log(コンソール・ログ=記録)= コンソールに文字を出す。動いたかの確認用
    // ※ この { } の中に移した。ここなら本当に準備できたときに出る
  });

// ③言葉を抽出するボタンを押したら、動く
function research() {
// function(ファンクション=関数)= ひとまとまりの「やること」を作る
// research(リサーチ=調べる)= 自分でつけた関数の名前。HTMLの onclick="research()" で呼ばれる
// ( ) が空 = 呼ぶときにわたすもの(引数)はなし
  if (tokenizer === null) {
  // === (イコール3つ)= 同じかどうか比べる。「箱がまだ空っぽ?」を調べる
    $("#status").text("まだ準備中です。もう少しお待ちください");
    return;
    // 空っぽなら知らせて、ここで終わり。空の係に頼むとエラーになるので止める
  }
  console.log("ボタンを押して動いてます");

  // 左の箱から文章を取り出す
  const text = $("#word").val();
  // const(コンスト=変えない箱)= 文章を入れる箱を作る。名前は text
  // $("#word")= 左の入力欄をつかむ / .val()(バル=value、値)= 中身を取り出す(かっこが空=取り出す)
  console.log(text);
  // 取り出した文章を、そのままコンソールに出して確認

  // 文章を単語に分ける
  const tokens = tokenizer.tokenize(text);
  // tokenizer.tokenize(トークナイズ=単語に分ける)= 係に「分けて」とお願い
  // (text)= 分けてほしい文章をわたす(引数)
  // tokens(トークンズ)= 分けた単語の一覧が入る箱。1つの単語には文字・品詞・読み方などが入っている

  // 名詞だけを集める
  const nouns = [];
  // nouns(ナウンズ=名詞たち)= 名詞を集める箱 / [ ](かっこ)= 空の一覧(配列)
  $.each(tokens, function (i, token) {
  // $.each(イーチ=それぞれ)= 一覧 tokens から1つずつ取り出してくり返す
  // i(アイ)= 何番目か(0,1,2…)が入る / token(トークン)= 取り出した単語1つが入る(どちらも引数)
    if (token.pos === "名詞") {
    // token.pos(ポス=part of speech、品詞)= その単語の品詞。「名詞」なら
      nouns.push(token.surface_form);
      // .push(プッシュ=押しこむ)= 一覧の最後に1つ足す
      // token.surface_form(サーフェス・フォーム=表に出ている形)= 文章に書かれたままの単語
    }
  });
  console.log("名詞を抽出できました", nouns);
  // 職業が届いて箱に入れたあとで、保存する
  // ※ $.each の外に移した。中だと単語の数だけ何回も出る。nouns もいっしょに出して中身を確認

  // 右の箱に入れる
  // 職業が届いて箱に入れたあとで、保存する
  $("#keitaiso_word").val(nouns.join("、"));
  // nouns.join("、")(ジョイン=つなぐ)= 一覧を「、」でつないで1つの文字にする(私、看護、師)
  // $("#keitaiso_word").val(…)= 右の入力欄に入れる(かっこに値=入れる)
  console.log("右に移動できました");
  // ※ 最後の } の上に移した。ここなら右に入れた直後に出る
} // function research の終わり

// ④「職業を調べる」ボタンを押したら動く
function keitaiso() {
    // 1. 下の箱を空にする(前の結果を消す)
    $("#job_result").empty();
  
    // 2. 右の箱の文字を「、」で分けて、名詞の一覧にする
    const words = $("#keitaiso_word").val().split("、");
  
    // 3. 名詞を1つずつ調べる
    $.each(words, function (i, word) {
      if (word.length >= 2) {
        // 1文字の言葉(私・師など)は広すぎるので、2文字以上だけ調べる
        searchJob(word);
      }
    });
  }
  
  // ⑤ 1つの名詞で、Wikidataから職業をさがす
  function searchJob(word) {
    // 1. Wikidataへの質問文を作る:「word をふくむ日本語名の職業を5件」
    const query =
      'SELECT DISTINCT ?jobLabel WHERE {' +
      ' VALUES ?type { wd:Q28640 wd:Q12737077 }' +
      ' ?job wdt:P31 ?type .' +
      ' ?job rdfs:label ?jobLabel .' +
      ' FILTER(LANG(?jobLabel) = "ja")' +
      ' FILTER(CONTAINS(?jobLabel, "' + word + '"))' +
      '} LIMIT 5';
  
    // 2. 質問文をつけたURL(住所)を作る
    const url = "https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(query);
    console.log("調べる言葉:", word);
  
    // 3. APIに聞く。答えが届いたら function (data) の中が動く
    $.getJSON(url, function (data) {
      console.log(word, "の答え:", data);
      // 4. 届いた職業を1つずつ、下の箱に足す
      $.each(data.results.bindings, function (i, item) {
        $("#job_result").append("<li>" + item.jobLabel.value + "(" + word + "から)</li>");
        saveJobs();   // 職業が届いて箱に入れたあとで、保存する
      });
    }).fail(function () {
      // うまく聞けなかったとき
      $("#job_result").append("<li>" + word + ":調べられませんでした</li>");
      saveJobs();   // 「調べられませんでした」も保存する
    });
  }

  function saveJobs() { 
      const jobs = $("#job_result").html() ;/* 職業の中身をそのまま取り出す */
      localStorage.setItem('interview_jobs',jobs);
      console.log('職業を保存しました')
  } 

  // データーを削除する
  // メモ帳から名前を指定して消す
  // 左右の入力欄を空にする.
  // 名詞と職業も空にする
  function deleta() {
    localStorage.removeItem("interview_jobs");
    $("#word").val("");
    $("#keitaiso_word").val("");
    $("#word_list").empty();
    $("#job_result").empty();
    console.log('削除しました')
  }