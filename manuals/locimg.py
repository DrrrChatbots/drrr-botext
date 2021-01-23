import sys, re, os
import ntpath

if len(sys.argv) < 2:
    print('input filename')
    exit(1)

filename = sys.argv[1]
with open(filename, 'r') as doc:
    ctx = doc.read()
    imgs = re.findall( r'(https://i.imgur.com/[^"]*)', ctx)
    for img in imgs:
        loc = 'img/{}'.format(ntpath.basename(img))
        if not os.path.isfile(loc):
            os.system("wget -O {} {}".format(loc, img))
    ctx = re.sub(r'https://i.imgur.com/', './img/', ctx)

print(ctx)

