import sys, re

if len(sys.argv) < 2:
    print('input filename')
    exit(1)

filename = sys.argv[1]
with open(filename, 'r') as doc:
    ctx = doc.read()
    ctx = re.sub(r'<link.*?>\s', '', ctx)
    ctx = re.sub(r'</title>', """
    </title>
    <link rel="icon" type="image/png" href="/icon.png">
    <link rel="apple-touch-icon" href="/icon.png">
    <link rel="stylesheet" href="/css/bootstrap.min.css"  />
    <link rel="stylesheet" href="/css/font-awesome.min.css"  />
    <link rel="stylesheet" href="/css/ionicons.min.css"  />
    <link rel="stylesheet" href="/css/octicons.min.css"  />
    <link rel="stylesheet" href="/css/prism.min.css"  />
    <link rel="stylesheet" href="/css/emojify.min.css"  />""", ctx)
    ctx = re.sub(r'<script.*?</script>', '', ctx)
    ctx = re.sub(r'<script(.|\n)*</script>', '', ctx)
    ctx = re.sub(r'</body>',
    """
    <script src="/js/jquery-3.4.1.min.js" ></script>
    <script src="/js/bootstrap.min.js"  defer></script>
    <script src="/js/gist-embed.min.js"  defer></script>
    <script src="/js/manual-inline.js" crossorigin="anonymous" defer></script></body>""", ctx)

print(ctx)
