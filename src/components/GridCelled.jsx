import React from 'react'
import {Grid,Image} from 'semantic-ui-react'

function GridCelled() {
    
   return( 
    <div>
        <Grid>
    
            <Grid.Row>
                <Grid.Column width={10}>
                    <Image src='./images/wireframe/image.png'/>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={5}>
                    <Image src='./images/wireframe/image.png'/>
                </Grid.Column>

                <Grid.Column width={5}>
                    <Image src='./images/wireframe/paragraph.png'/>
                </Grid.Column>
            </Grid.Row>

        </Grid>
    </div>
   );
}      

export default GridCelled
