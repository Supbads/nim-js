#build
mkdir target
cp nim.html nim.js nim.css target
mv target/nim.html target/index.html

#deploy
aws s3 sync target s3://static-sites.rachelbarrett.uk/js/nim

#cleanup
rm -r target