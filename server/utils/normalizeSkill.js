// "  Public   Speaking " -> "public speaking"
module.exports = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
