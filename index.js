const upstreamTransformer = require('./upstreamTransformer');
const { compile } = require('./compiler');

// handle RN version >= 0.46
const isOldRN = ({ src }) => src && typeof src === 'object';

const transform = params => {
  const { src, filename, options } = isOldRN(params) ? params.src : params;
  const outputFile = compile(src);

  return upstreamTransformer.transform({
    src: outputFile,
    filename,
    options,
  });
};

module.exports = {
  transform,
};
