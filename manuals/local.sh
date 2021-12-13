for fn in $*;do
  python localize.py $fn > tmp.html
  python locimg.py tmp.html > $fn
  rm tmp.html
done
