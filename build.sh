#!/bin/bash

#build it
tsc

#build the sprite list
cd release
../buildSpriteList.py ../sprites.json spritePack.json animations.json sprites
cd ..
