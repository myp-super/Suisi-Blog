export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="text-3xl sm:text-4xl font-heading font-bold glow-text mb-8">关于邃思</h1>

      <div className="prose max-w-none">
        <p>
          <strong>邃思</strong>，取意&quot;深远的思考&quot;。
        </p>

        <h2>为什么是这个名字</h2>
        <p>
          在信息洪流的时代，我们被碎片化的内容包围着。算法推送、短视频、速食阅读——
          这些都在悄无声息地重塑我们思考的方式。越来越少的人愿意花时间去深思一个问题，
          越来越少的人能够耐心地阅读一篇长文。
        </p>
        <p>
          邃思的建立，是一次对抗。对抗碎片化，对抗浅阅读，对抗思考的贫瘠。
        </p>

        <h2>这里有什么</h2>
        <ul>
          <li><strong>技术文章</strong>：深入探讨前端、后端、系统设计、编程语言等领域。不追逐热点，只沉淀值得留下的内容。</li>
          <li><strong>项目展示</strong>：我参与或独立完成的开源项目，附带详细的技术说明。</li>
          <li><strong>读书笔记</strong>：阅读过程中的思考、摘录和感悟。</li>
          <li><strong>生活随笔</strong>：技术之外的观察与思考。</li>
        </ul>

        <h2>关于作者</h2>
        <p>
          一名热爱技术的开发者和终身学习者。相信代码可以改变世界，也相信文字可以温暖人心。
        </p>
        <p>
          在这个小小的知识花园里，我分享我所学、所思、所感。希望你能在这里找到一些有价值的内容。
        </p>

        <blockquote>
          <p>学而不思则罔，思而不学则殆。 —— 孔子</p>
        </blockquote>

        <h2>联系方式</h2>
        <p>
          如果你有任何想法、建议或只是想打个招呼，欢迎通过 GitHub 找到我。
        </p>
      </div>
    </div>
  );
}
