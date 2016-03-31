import marked from 'marked';
import Prism from './Prism';

const getMarked = function() {
  let renderer = new marked.Renderer();
  renderer.code = function(code, lang) {
    return Prism.amtHighlight({
      text: code,
      language: lang,
      ln: 1
    });
  };

  return {
    renderer: renderer,
    gfm: true
  };
};

export default getMarked;
