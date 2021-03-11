python localize.py $1 > tmp.html
python locimg.py tmp.html > $1
rm tmp.html
