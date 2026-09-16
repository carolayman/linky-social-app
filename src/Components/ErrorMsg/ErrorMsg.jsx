import { Alert } from '@heroui/react'
import React from 'react'

export default function ErrorMsg({error}) {
  return (
    <>
        {error && <> 
        <Alert className=" bg-red-100 text-red-500 rounded-2xl mt-3" status="danger"> 
            <Alert.Indicator /> 
                <Alert.Content> 
                    <Alert.Title>{error.message}</Alert.Title> 
                </Alert.Content>
        </Alert> </> }
    </>
  )
}
