    #!/bin/bash
    docker build --build-arg SPOTIFY_ID=$SPOTIFY_ID --build-arg SPOTIFY_SECRET=$SPOTIFY_SECRET -t $IMAGE_NAME