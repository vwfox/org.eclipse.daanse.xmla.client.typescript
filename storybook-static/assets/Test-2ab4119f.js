import{j as e}from"./jsx-runtime-c1eb31e6.js";import{M as n}from"./index-78c1a554.js";import{u as s}from"./index-38c97340.js";import"./iframe-68f933e7.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-de833af9.js";import"./index-11d98b33.js";import"./index-9ad20695.js";import"./index-356e4a49.js";function i(t){const o=Object.assign({h1:"h1",p:"p",code:"code"},s(),t.components);return e.jsxs(e.Fragment,{children:[e.jsx(n,{title:"Configure your project2"}),`
`,e.jsxs("div",{className:"sb-container",children:[e.jsxs("div",{className:"sb-section-title",children:[e.jsx(o.h1,{id:"configure-your-project",children:"Configure your project"}),e.jsx(o.p,{children:"Because Storybook works separately from your app, you'll need to configure it for your specific stack and setup. Below, explore guides for configuring Storybook with popular frameworks and tools. If you get stuck, learn how you can ask for help from our community."})]}),e.jsxs("div",{className:"sb-section",children:[e.jsxs("div",{className:"sb-section-item",children:[e.jsx("h4",{className:"sb-section-item-heading",children:"Add styling and CSS"}),e.jsx("p",{className:"sb-section-item-paragraph",children:"Like with web applications, there are many ways to include CSS within Storybook. Learn more about setting up styling within Storybook."}),e.jsx("a",{href:"https://storybook.js.org/docs/vue/configure/styling-and-css",target:"_blank",children:"Learn more"})]}),e.jsxs("div",{className:"sb-section-item",children:[e.jsx("h4",{className:"sb-section-item-heading",children:"Provide context and mocking"}),e.jsx("p",{className:"sb-section-item-paragraph",children:"Often when a story doesn't render, it's because your component is expecting a specific environment or context (like a theme provider) to be available."}),e.jsx("a",{href:"https://storybook.js.org/docs/vue/writing-stories/decorators#context-for-mocking",target:"_blank",children:"Learn more"})]}),e.jsx("div",{className:"sb-section-item",children:e.jsxs("div",{children:[e.jsx("h4",{className:"sb-section-item-heading",children:"Load assets and resources"}),e.jsxs("p",{className:"sb-section-item-paragraph",children:[`To link static files (like fonts) to your projects and stories, use the
`,e.jsx(o.code,{children:"staticDirs"}),` configuration option to specify folders to load when
starting Storybook.`]}),e.jsx("a",{href:"https://storybook.js.org/docs/vue/configure/images-and-assets",target:"_blank",children:"Learn more"})]})})]})]}),`
`,e.jsx("style",{children:`
  .sb-container {
    margin-bottom: 48px;
  }

      .sb-section {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 20px;
      }

      img {
        object-fit: cover;
      }

      .sb-section-title {
        margin-bottom: 32px;
      }

      .sb-section a:not(h1 a, h2 a, h3 a) {
        font-size: 14px;
      }

      .sb-section-item, .sb-grid-item {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .sb-section-item-heading {
        padding-top: 20px !important;
        padding-bottom: 5px !important;
        margin: 0 !important;
      }
      .sb-section-item-paragraph {
        margin: 0;
        padding-bottom: 10px;
      }

      .sb-chevron {
        margin-left: 5px;
      }

      .sb-features-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 32px 20px;
      }

      .sb-socials {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }

      .sb-socials p {
        margin-bottom: 10px;
      }

      .sb-explore-image {
        max-height: 32px;
        align-self: flex-start;
      }

      .sb-addon {
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
        background-color: #EEF3F8;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        background: #EEF3F8;
        height: 180px;
        margin-bottom: 48px;
        overflow: hidden;
      }

      .sb-addon-text {
        padding-left: 48px;
        max-width: 240px;
      }

      .sb-addon-text h4 {
        padding-top: 0px;
      }

      .sb-addon-img {
        position: absolute;
        left: 345px;
        top: 0;
        height: 100%;
        width: 200%;
        overflow: hidden;
      }

      .sb-addon-img img {
        width: 650px;
        transform: rotate(-15deg);
        margin-left: 40px;
        margin-top: -72px;
        box-shadow: 0 0 1px rgba(255, 255, 255, 0);
        backface-visibility: hidden;
      }

      @media screen and (max-width: 800px) {
        .sb-addon-img {
          left: 300px;
        }
      }

      @media screen and (max-width: 600px) {
        .sb-section {
          flex-direction: column;
        }

        .sb-features-grid {
          grid-template-columns: repeat(1, 1fr);
        }

        .sb-socials {
          grid-template-columns: repeat(2, 1fr);
        }

        .sb-addon {
          height: 280px;
          align-items: flex-start;
          padding-top: 32px;
          overflow: hidden;
        }

        .sb-addon-text {
          padding-left: 24px;
        }

        .sb-addon-img {
          right: 0;
          left: 0;
          top: 130px;
          bottom: 0;
          overflow: hidden;
          height: auto;
          width: 124%;
        }

        .sb-addon-img img {
          width: 1200px;
          transform: rotate(-12deg);
          margin-left: 0;
          margin-top: 48px;
          margin-bottom: -40px;
          margin-left: -24px;
        }
      }
`})]})}function h(t={}){const{wrapper:o}=Object.assign({},s(),t.components);return o?e.jsx(o,Object.assign({},t,{children:e.jsx(i,t)})):i(t)}export{h as default};
//# sourceMappingURL=Test-2ab4119f.js.map
