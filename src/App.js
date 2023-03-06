import { FormControl, Button, FormLabel, Input, useDisclosure } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import { useState } from "react";
import axios from "axios";


const App = () => {


  const [getImageInput, setGetImageInput] = useState('');

  const [imageName, setImageName] = useState('');

  const [getImageUrl, setGetImageUrl] = useState('');

  const [loading, setLoading] = useState();

  const [onDispModal, setOnDispModal] = useState();


  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();


  const onSubmitForm = async (e) => {

    e.preventDefault();

    try {

      setOnDispModal(false);

      setLoading(true);

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/openai/generateImage`, { imageName: getImageInput });

      setImageName(data.generatedImageName)

      setGetImageUrl(data.imageUrl);

      setLoading(false);

      setOnDispModal(true);

      toast({
        title: 'Success.',
        description: "Your image has been generated successfully.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {

      setLoading(false);

      setOnDispModal(false);

      toast({
        title: 'Failure.',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

    }


  };


  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center text-center">

      <div className="flex flex-col gap-8">

        <h1 className="text-3xl lg:text-5xl text-white tracking-tightest font-cabin">Image Generator</h1>

        <p className="text-lg lg:text-xl text-white font-mukta tracking-wider mb-7">A tool created with the help of React, OpenAPI and NodeJS which will generate random images based on the input given to it.</p>

        <form onSubmit={onSubmitForm}>

          <FormControl isRequired>

            <FormLabel className="text-white">Image Name</FormLabel>

            <Input
              type='text'
              placeholder="enter the text whose image you want to generate"
              className="text-white"
              onChange={(e) => setGetImageInput(e.target.value)}
            />

            {loading ? <Button
              type="submit"
              size="lg"
              className="mt-5 w-full tracking-wide cursor-not-allowed"
              colorScheme="cyan"
              onClick={onOpen}
              isLoading
            ><Spinner /></Button> : <Button
              type="submit"
              size="lg"
              className="mt-5 w-full tracking-wide"
              colorScheme="cyan"
              onClick={onOpen}
            >Generate Image</Button>}

            {onDispModal && <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{imageName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <img src={getImageUrl} alt={getImageInput} className="bg-no-repeat bg-cover bg-center" />
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>}

          </FormControl>

        </form>

      </div>

    </div>
  )
};

export default App;