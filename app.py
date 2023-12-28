import http.server
import json

PORT = 3213
JSON_PATH = "index.json"


class CustomHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open("index.html", "rb") as f:
                self.wfile.write(f.read())

    def do_POST(self):
        if self.path == '/loadData':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.wfile.write(json.dumps(data).encode('utf-8'))


def run_server(port):
    server_address = ('', port)
    httpd = http.server.HTTPServer(server_address, CustomHandler)
    print(f"서버가 http://localhost:{port}/ 에서 실행 중입니다.")
    httpd.serve_forever()


if __name__ == '__main__':
    run_server(PORT)