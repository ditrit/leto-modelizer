import { readTextFile } from 'src/composables/Files';

class MockXMLHttpRequest {
  open(method, path) {
    this.method = method;
    this.path = path;
  }

  send() {
    if (this.path === 'success') {
      this.status = 200;
      this.responseText = 'content';
      this.onload();
    } else if (this.path === 'fail') {
      this.status = 404;
      this.statusText = 'not found';
      this.onload();
    } else {
      this.statusText = 'error';
      this.onerror();
    }
  }
}

window.XMLHttpRequest = MockXMLHttpRequest;

describe('Test composable: Files', () => {
  describe('Test function: readTextFile', () => {
    it('should return a file with a content attribute on success', async () => {
      const result = await readTextFile('success');
      expect(result).toEqual('content');
    });
    it('should throw an error on onload reject', async () => {
      const result = await readTextFile('fail').catch((e) => e);
      expect(result).toEqual('not found');
    });
    it('should throw an error on onerror reject', async () => {
      const result = await readTextFile().catch((e) => e);
      expect(result).toEqual('error');
    });
  });
});
